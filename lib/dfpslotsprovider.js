"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _manager = _interopRequireDefault(require("./manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DFPSlotsProvider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DFPSlotsProvider, _React$Component);

  function DFPSlotsProvider(props) {
    var _this;

    _classCallCheck(this, DFPSlotsProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DFPSlotsProvider).call(this, props));
    _this.loadAdsIfPossible = _this.loadAdsIfPossible.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.newSlotCallback = _this.newSlotCallback.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.applyConfigs = _this.applyConfigs.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.shouldReloadConfig = _this.shouldReloadConfig.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.attachLoadCallback = _this.attachLoadCallback.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.loadAlreadyCalled = false;
    _this.loadCallbackAttached = false;
    _this.shouldReloadAds = false;
    _this.totalSlots = 0;
    return _this;
  }

  _createClass(DFPSlotsProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        dfpNetworkId: this.props.dfpNetworkId,
        dfpAdUnit: this.props.adUnit,
        dfpSizeMapping: this.props.sizeMapping,
        dfpTargetingArguments: this.props.targetingArguments,
        newSlotCallback: this.newSlotCallback
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.applyConfigs();

      if (this.props.autoLoad && !this.loadAdsIfPossible()) {
        this.attachLoadCallback();
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      this.shouldReloadAds = this.shouldReloadConfig(nextProps);

      if (nextProps.children !== this.props.children) {
        return true;
      }

      if (nextProps.autoLoad && !this.props.autoLoad) {
        return true;
      }

      return this.shouldReloadAds;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.applyConfigs();

      if (this.props.autoLoad) {
        if (this.loadAlreadyCalled) {
          if (this.shouldReloadAds) {
            _manager.default.reload();
          }
        } else if (!this.loadAdsIfPossible()) {
          this.attachLoadCallback();
        }
      }

      this.shouldReloadAds = false;
    }
  }, {
    key: "applyConfigs",
    value: function applyConfigs() {
      _manager.default.configurePersonalizedAds(this.props.personalizedAds);

      _manager.default.configureSingleRequest(this.props.singleRequest);

      _manager.default.configureLazyLoad(!!this.props.lazyLoad, typeof this.props.lazyLoad === 'boolean' ? null : this.props.lazyLoad);

      _manager.default.setAdSenseAttributes(this.props.adSenseAttributes);

      _manager.default.setCollapseEmptyDivs(this.props.collapseEmptyDivs);
    }
  }, {
    key: "attachLoadCallback",
    value: function attachLoadCallback() {
      if (this.loadCallbackAttached === false) {
        _manager.default.on('slotRegistered', this.loadAdsIfPossible);

        this.loadCallbackAttached = true;
        return true;
      }

      return false;
    } // pretty strait-forward interface that children ads use to register
    // with their DFPSlotProvider parent node.

  }, {
    key: "newSlotCallback",
    value: function newSlotCallback() {
      this.totalSlots++;
    } // Checks all the mounted children ads have been already registered
    // in the DFPManager before trying to call the gpt load scripts.
    // This is helpful when trying to fetch ads with a single request.

  }, {
    key: "loadAdsIfPossible",
    value: function loadAdsIfPossible() {
      var r = false;

      if (Object.keys(_manager.default.getRegisteredSlots()).length >= this.totalSlots) {
        _manager.default.removeListener('slotRegistered', this.loadAdsIfPossible);

        _manager.default.load();

        this.loadAlreadyCalled = true;
        this.loadCallbackAttached = false;
        r = true;
      }

      return r;
    }
  }, {
    key: "shouldReloadConfig",
    value: function shouldReloadConfig(nextProps) {
      var reloadConfig = nextProps.autoReload || this.props.autoReload;

      if (this.props.autoLoad || nextProps.autoLoad) {
        if (_typeof(reloadConfig) === 'object') {
          var attrs = Object.keys(reloadConfig); // eslint-disable-next-line guard-for-in, no-restricted-syntax

          for (var i in attrs) {
            var propName = attrs[i]; // eslint-disable-next-line

            if (reloadConfig[propName] === true && this.props[propName] !== nextProps[propName]) {
              return true;
            }
          }
        }
      }

      return false;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, " ", this.props.children, " ");
    }
  }]);

  return DFPSlotsProvider;
}(_react.default.Component);

exports.default = DFPSlotsProvider;

_defineProperty(DFPSlotsProvider, "propTypes", {
  children: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.array]).isRequired,
  autoLoad: _propTypes.default.bool,
  autoReload: _propTypes.default.shape({
    dfpNetworkId: _propTypes.default.bool,
    personalizedAds: _propTypes.default.bool,
    singleRequest: _propTypes.default.bool,
    adUnit: _propTypes.default.bool,
    sizeMapping: _propTypes.default.bool,
    adSenseAttributes: _propTypes.default.bool,
    targetingArguments: _propTypes.default.bool,
    collapseEmptyDivs: _propTypes.default.bool,
    lazyLoad: _propTypes.default.bool
  }),
  dfpNetworkId: _propTypes.default.string.isRequired,
  personalizedAds: _propTypes.default.bool,
  singleRequest: _propTypes.default.bool,
  adUnit: _propTypes.default.string,
  sizeMapping: _propTypes.default.arrayOf(_propTypes.default.object),
  adSenseAttributes: _propTypes.default.object,
  targetingArguments: _propTypes.default.object,
  collapseEmptyDivs: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.object]),
  adSenseAttrs: _propTypes.default.object,
  lazyLoad: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.shape({
    fetchMarginPercent: _propTypes.default.number,
    renderMarginPercent: _propTypes.default.number,
    mobileScaling: _propTypes.default.number
  })])
});

_defineProperty(DFPSlotsProvider, "childContextTypes", {
  dfpNetworkId: _propTypes.default.string,
  dfpAdUnit: _propTypes.default.string,
  dfpSizeMapping: _propTypes.default.arrayOf(_propTypes.default.object),
  dfpTargetingArguments: _propTypes.default.object,
  newSlotCallback: _propTypes.default.func
});

_defineProperty(DFPSlotsProvider, "defaultProps", {
  autoLoad: true,
  autoReload: {
    dfpNetworkId: false,
    personalizedAds: false,
    singleRequest: false,
    adUnit: false,
    sizeMapping: false,
    adSenseAttributes: false,
    targetingArguments: false,
    collapseEmptyDivs: false,
    lazyLoad: false
  },
  personalizedAds: true,
  singleRequest: true,
  collapseEmptyDivs: null,
  lazyLoad: false
});