pragma solidity 0.6.2;

import "./WithOperator.sol";

interface ISpot {
    function ilks(bytes32 _ilk) external view returns (address _pip, uint256 _mat);
}

interface IUnwind {
    function unwind(uint256 _cdp) external;
    function charge(uint256 _cdp) external;
    function period() external view returns (uint256 _period);
    function fee() external view returns (uint256 _fee);
    function flat() external view returns (bool _flat);
    function payments() external view returns (uint256 _period, uint256 _fee, bool _flat);
}

interface IRegistry {
    function lookup(bytes32 _name) external view returns (address _addr);
    function lookupToken(bytes32 ilk) external view returns (address addr);
}

interface IDSProxy {
    function owner() external view returns (address);
    function execute(address, bytes calldata) external payable returns (bytes memory);
}

interface ICdpManager {
    function cdpCan(address, uint, address) external view returns (uint);
    function owns(uint) external view returns (address);
    function urns(uint) external view returns (address);
    function ilks(uint) external view returns (bytes32);
    function vat() external view returns (address);
    function frob(uint, int, int) external;
    function flux(uint, address, uint) external;
    function move(uint, address, uint) external;
}

interface IMatchingMarket {
    function sellAllAmount(address pay_gem, uint256 pay_amt, address buy_gem, uint256 min_fill_amount) external returns (uint256 fill_amt);
}

interface IERC20 {
    function totalSupply() external view returns (uint supply);
    function balanceOf(address _owner) external view returns (uint balance);
    function transfer(address _to, uint _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    function approve(address _spender, uint _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function decimals() external view returns(uint digits);
}

interface IVat {
    function ilks(bytes32) external view returns (uint, uint, uint, uint, uint);
    function dai(address) external view returns (uint);
    function urns(bytes32, address) external view returns (uint, uint);
    function can(address, address) external view returns (uint);
    function hope(address) external;
}

interface IGem {
    function approve(address, uint) external;
}

interface IDaiJoin {
    function dai() external returns (IGem);
    function join(address, uint) external payable;
    function exit(address, uint) external;
}

interface IGemJoin {
    function exit(address, uint) external;
}

interface IJug {
    function drip(bytes32) external returns (uint);
}

abstract contract IWallet is IERC20 {
    function deposit() external virtual payable;
    function withdraw(uint256 _amount) external virtual;
}

contract Unwind {
    event LogUnwind(uint256 cdp);
    event LogCharge(uint256 cdp, uint256 amount);

    IRegistry public registry;
    address public beneficiary;
    uint256 public period;
    uint256 public fee;
    bool public flat;

    uint constant WAD = 10 ** 18;
    uint constant RAY = 10 ** 27;

    // name => contract
    mapping(bytes32 => address) services;
    mapping(bytes32 => address) tokens;

    // cdp => charge expiration date
    mapping (uint256 => uint256) public charges;

    modifier allowed(uint256 cdp) {
        require(cdpManager().cdpCan(cdpManager().owns(cdp), cdp, address(this)) == 1, "ERROR::CDP_NOT_ALLOWED");
        _;
    }

    constructor(address _registry, address _beneficiary, uint256 _period, uint256 _fee, bool _flat) public {
        require(_registry != address(0), "ERROR::INVALID_ADDRESS");
        require(_beneficiary != address(0), "ERROR::INVALID_ADDRESS");
        require(_period != 0, "ERROR::INVALID_PERIOD");

        if (_flat == true) {
            require(_fee <= 0.5 ether, "ERROR::INVALID_FEE");
        } else {
            require(_fee <= 0.1 ether, "ERROR::INVALID_FEE");
        }

        registry = IRegistry(_registry);
        beneficiary = _beneficiary;
        period = _period;
        fee = _fee;
        flat = _flat;
    }

    function getService(bytes32 _name) public view returns (address _addr) {
        _addr = registry.lookup(_name);
        require(_addr != address(0), "ERROR::INVALID_ADDRESS");
    }

    function getToken(bytes32 _name) public view returns (address _addr) {
        _addr = registry.lookupToken(_name);
        require(_addr != address(0), "ERROR::INVALID_ADDRESS");
    }

    function setService(bytes32 _name) public {
        services[_name] = registry.lookup(_name);
        require(services[_name] != address(0), "ERROR::INVALID_ADDRESS");
    }

    function setToken(bytes32 _name) public {
        tokens[_name] = registry.lookupToken(_name);
        require(tokens[_name] != address(0), "ERROR::INVALID_ADDRESS");
    }

    function payments() external view returns (uint256 _period, uint256 _fee, bool _flat) {
        _period = period;
        _fee = fee;
        _flat = flat;
    }

    function unwind(uint256 cdp) external allowed(cdp) {
        address urn = cdpManager().urns(cdp);
        bytes32 ilk = cdpManager().ilks(cdp);

        (, uint256 rate, uint256 spot,,) = vat().ilks(ilk);
        (uint256 ink, uint256 art) = vat().urns(ilk, urn);

        uint256 bat = mul(ink, spot);
        uint256 tab = mul(art, rate);

        require(
            (mul(bat, 1000)) > mul(tab, 1034) && (mul(bat, 1000)) < mul(tab, 1100),
            "ERROR::NOT_UNWINDABLE"
        );

        uint256 amount = sub(bat, tab) / spot;

        cdpManager().frob(cdp, -toInt(amount), getWipeDart(urn, ilk));

        // Move the amount from the CDP urn to unwind contract
        cdpManager().flux(cdp, address(this), amount);

        // Exits token amount to unwind contract as a token
        gemJoin(ilk).exit(address(this), amount);

        token(ilk).approve(address(exchange()), amount);

        uint256 daiAmount = exchange().sellAllAmount(address(token(ilk)), amount, address(dai()), 0);

        daiJoin().dai().approve(address(daiJoin()), daiAmount);
        daiJoin().join(urn, daiAmount);

        cdpManager().frob(cdp, 0, getWipeDart(urn, ilk));

        emit LogUnwind(cdp);
    }

    function charge(uint256 cdp) external allowed(cdp) {
        if (charges[cdp] != 0) {
            require(block.timestamp >= charges[cdp], "ERROR::CDP_ALREADY_CHARGED");

            charges[cdp] = block.timestamp - (block.timestamp - charges[cdp]) % period + period;
        } else {
            charges[cdp] = block.timestamp + period;
        }

        address urn = cdpManager().urns(cdp);
        bytes32 ilk = cdpManager().ilks(cdp);

        uint256 chargeAmount;
        if (flat == true) {
            chargeAmount = fee;
        } else {
            (, uint256 art) = vat().urns(ilk, urn);

            chargeAmount = art * fee / WAD;
        }

        require(chargeAmount > 0, "ERROR::ZERO_CHARGE");

        // Generate debt in the CDP
        cdpManager().frob(cdp, 0, getDrawDart(urn, ilk, chargeAmount));

        // Move the DAI amount (balance in the vat in rad) to unwind's address
        cdpManager().move(cdp, address(this), toRad(chargeAmount));

        // Allow access to DAI balance in the vat
        if (vat().can(address(this), address(daiJoin())) == 0) {
            vat().hope(address(daiJoin()));
        }
        // Exit DAI to the distributor's wallet as a token
        daiJoin().exit(beneficiary, chargeAmount);

        emit LogCharge(cdp, chargeAmount);
    }

    function getDrawDart(
        address urn,
        bytes32 ilk,
        uint wad
    ) public returns (int dart) {
        // Updates stability fee rate
        uint rate = jug().drip(ilk);

        // Gets DAI balance of the urn in the vat
        uint dai = vat().dai(urn);

        // If there was already enough DAI in the vat balance, just exits it without adding more debt
        if (dai < mul(wad, RAY)) {
            // Calculates the needed dart so together with the existing dai in the vat is enough to exit wad amount of DAI tokens
            dart = toInt(sub(mul(wad, RAY), dai) / rate);
            // This is neeeded due lack of precision. It might need to sum an extra dart wei (for the given DAI wad amount)
            dart = mul(uint(dart), rate) < mul(wad, RAY) ? dart + 1 : dart;
        }
    }

    function getWipeDart(address urn, bytes32 ilk) public view returns (int dart) {
        uint256 dai = vat().dai(urn);
        // Gets actual rate from the vat
        (, uint rate,,,) = vat().ilks(ilk);
        // Gets actual art value of the urn
        (, uint art) = vat().urns(ilk, urn);

        // Uses the whole dai balance in the vat to reduce the debt
        dart = toInt(dai / rate);
        // Checks the calculated dart is not higher than urn.art (total debt), otherwise uses its value
        dart = uint(dart) <= art ? - dart : - toInt(art);
    }

    function spot() internal view returns (ISpot) {
        return ISpot(getService("SPOT"));
    }

    function vat() internal view returns (IVat) {
        return IVat(getService("VAT"));
    }

    function jug() internal view returns (IJug) {
        return IJug(getService("JUG"));
    }

    function daiJoin() internal view returns (IDaiJoin) {
        return IDaiJoin(getService("DAI_JOIN"));
    }

    function gemJoin(bytes32 ilk) internal view returns (IGemJoin) {
        return IGemJoin(getService(ilk));
    }

    function cdpManager() internal view returns (ICdpManager) {
        return ICdpManager(getService("CDP_MANAGER"));
    }

    function dai() internal view returns (IERC20) {
        return IERC20(getService("DAI"));
    }

    function exchange() internal view returns (IMatchingMarket) {
        return IMatchingMarket(getService("OASIS_TRADE"));
    }

    function token(bytes32 ilk) internal view returns (IERC20) {
        return IERC20(getToken(ilk));
    }

    function toInt(uint256 x) internal pure returns (int256 y) {
        y = int(x);
        require(y >= 0, "int-overflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "mul-overflow");
    }

    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, "sub-overflow");
    }

    function min(uint x, uint y) internal pure returns (uint z) {
        return x <= y ? x : y;
    }

    function toRad(uint wad) internal pure returns (uint rad) {
        rad = mul(wad, RAY);
    }
}

