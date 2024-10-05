


    /**

    - Website: testing.com
    - Twitter: http://harlytwitter
    - Telegram: https://t.me/Makeamericahealthyagain
    - Discord: https://discord.com/invite/fWFEDSjA8e
    
    */
    // SPDX-License-Identifier: MIT
    
    pragma solidity ^0.8.0;
    
    abstract contract Context {
        function _msgSender() internal view virtual returns (address) {
            return msg.sender;
        }
    
        function _msgData() internal view virtual returns (bytes calldata) {
            this; 
            return msg.data;
        }
    }
    
    interface IERC20 {
        function totalSupply() external view returns (uint256);
    
        function balanceOf(address account) external view returns (uint256);
    
        function transfer(address recipient, uint256 amount) external returns (bool);
    
        function allowance(address owner, address spender) external view returns (uint256);
    
        function approve(address spender, uint256 amount) external returns (bool);
    
        function transferFrom(
            address sender,
            address recipient,
            uint256 amount
        ) external returns (bool);
    
        event Transfer(address indexed from, address indexed to, uint256 value);
    
        event Approval(address indexed owner, address indexed spender, uint256 value);
    }
    
    interface IERC20Metadata is IERC20 {
    
        function name() external view returns (string memory);
    
        function symbol() external view returns (string memory);
    
        function decimals() external view returns (uint8);
    }
    
    
    contract ERC20 is Context, IERC20, IERC20Metadata {
        mapping (address => uint256) internal _balances;
    
        mapping (address => mapping (address => uint256)) internal _allowances;
    
        uint256 private _totalSupply;
    
        string private _name;
        string private _symbol;
    
        constructor (string memory name_, string memory symbol_) {
            _name = name_;
            _symbol = symbol_;
        }
    
    
        function name() public view virtual override returns (string memory) {
            return _name;
        }
    
        function symbol() public view virtual override returns (string memory) {
            return _symbol;
        }
    
        function decimals() public view virtual override returns (uint8) {
            return 18;
        }
    
        function totalSupply() public view virtual override returns (uint256) {
            return _totalSupply;
        }
    
        function balanceOf(address account) public view virtual override returns (uint256) {
            return _balances[account];
        }
    
        function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
            _transfer(_msgSender(), recipient, amount);
            return true;
        }
    
        function allowance(address owner, address spender) public view virtual override returns (uint256) {
            return _allowances[owner][spender];
        }
    
        function approve(address spender, uint256 amount) public virtual override returns (bool) {
            _approve(_msgSender(), spender, amount);
            return true;
        }
    
        function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
            _transfer(sender, recipient, amount);
    
            uint256 currentAllowance = _allowances[sender][_msgSender()];
            require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
            _approve(sender, _msgSender(), currentAllowance - amount);
    
            return true;
        }
    
        function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
            _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
            return true;
        }
    
        function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
            uint256 currentAllowance = _allowances[_msgSender()][spender];
            require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
    
            return true;
        }
    
        function _transfer(address sender, address recipient, uint256 amount) internal virtual {
            require(sender != address(0), "ERC20: transfer from the zero address");
            require(recipient != address(0), "ERC20: transfer to the zero address");
    
            _beforeTokenTransfer(sender, recipient, amount);
    
            uint256 senderBalance = _balances[sender];
            require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
            _balances[sender] = senderBalance - amount;
            _balances[recipient] += amount;
    
            emit Transfer(sender, recipient, amount);
        }
    
        function _mint(address account, uint256 amount) internal virtual {
            require(account != address(0), "ERC20: mint to the zero address");
    
            _beforeTokenTransfer(address(0), account, amount);
    
            _totalSupply += amount;
            _balances[account] += amount;
            emit Transfer(address(0), account, amount);
        }
    
        function _approve(address owner, address spender, uint256 amount) internal virtual {
            require(owner != address(0), "ERC20: approve from the zero address");
            require(spender != address(0), "ERC20: approve to the zero address");
    
            _allowances[owner][spender] = amount;
            emit Approval(owner, spender, amount);
        }
    
        function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
    }
    
    library Address{
        function sendValue(address payable recipient, uint256 amount) internal {
            require(address(this).balance >= amount, "Address: insufficient balance");
    
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "Address: unable to send value, recipient may have reverted");
        }
    }
    
    abstract contract Ownable is Context {
        address private _owner;
    
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
        constructor() {
            _setOwner(_msgSender());
        }
    
        function owner() public view virtual returns (address) {
            return _owner;
        }
    
        modifier onlyOwner() {
            require(owner() == _msgSender(), "Ownable: caller is not the owner");
            _;
        }
    
        function renounceOwnership() public virtual onlyOwner {
            _setOwner(address(0));
        }
    
        function transferOwnership(address newOwner) public virtual onlyOwner {
            require(newOwner != address(0), "Ownable: new owner is the zero address");
            _setOwner(newOwner);
        }
    
        function _setOwner(address newOwner) private {
            address oldOwner = _owner;
            _owner = newOwner;
            emit OwnershipTransferred(oldOwner, newOwner);
        }
    }
    
    interface IFactory{
            function createPair(address tokenA, address tokenB) external returns (address pair);
    }
    
    interface IRouter {
        function factory() external pure returns (address);
        function WETH() external pure returns (address);
        function addLiquidityETH(
            address token,
            uint amountTokenDesired,
            uint amountTokenMin,
            uint amountETHMin,
            address to,
            uint deadline
        ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
        function swapExactTokensForETHSupportingFeeOnTransferTokens(
            uint amountIn,
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline) external;
    }
    
    contract MyToken is ERC20, Ownable{
        using Address for address payable;
        
        IRouter public router;
        address public pair;
        
        bool private swapping;
        bool public swapEnabled;
        bool public launched;
    
    
        modifier lockSwapping() {
            swapping = true;
            _;
            swapping = false;
        }
        
        event TransferForeignToken(address token, uint256 amount);
        event Launched();
        event SwapEnabled();
        event SwapThresholdUpdated();
        event BuyTaxesUpdated();
        event SellTaxesUpdated();
        event MarketingWalletUpdated();
        event teamWalletUpdated();
        event utilityWalletUpdated();
        event ExcludedFromFeesUpdated();
        event MaxTxAmountUpdated();
        event MaxWalletAmountUpdated();
        event StuckEthersCleared();
        
        uint256 public swapThreshold = 1000000 * 10**18; 
        
        address public marketingWallet ;
        address public teamWallet ;
        
        struct Taxes {
            uint256 marketing;
            uint256 liquidity;
            uint256 team;
            uint256 utility;
            uint256 burn;
         }
        
        Taxes public buyTaxes ;
        Taxes public sellTaxes ;
        uint256 private totBuyTax ; 
        uint256 private totSellTax; 
    
        uint256 _totalSupply = 10000 * 10 ** 18;
        
        mapping (address => bool) public excludedFromFees;
        
        modifier inSwap() {
            if (!swapping) {
                swapping = true;
                _;
                swapping = false;
            }
        }
    
        constructor (address _marketing , address _team , uint256 _liquidityFee , uint256 _marketingFee , uint256 _utilityFee , uint256 _teamFee , uint256 _burnFee ) ERC20("Muhammad Ramzan", "HTest") {
    
    
            _mint(msg.sender,_totalSupply );
            excludedFromFees[msg.sender] = true;
    
            IRouter _router = IRouter(0xedf6066a2b290C185783862C7F4776A2C8077AD1);// 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
            address _pair = IFactory(_router.factory())
                .createPair(address(this), _router.WETH());
    
            router = _router;
            pair = _pair;
    
            marketingWallet = _marketing;
            teamWallet = _team ;
    
            buyTaxes = Taxes(_marketingFee,_liquidityFee,_teamFee,_utilityFee , _burnFee);
            sellTaxes = Taxes(_marketingFee,_liquidityFee,_teamFee,_utilityFee , _burnFee);
            totBuyTax = _marketingFee + _liquidityFee + _teamFee +_utilityFee + _burnFee;
            totSellTax = _marketingFee + _liquidityFee + _teamFee +_utilityFee + _burnFee;
    
    
            excludedFromFees[address(this)] = true;
            excludedFromFees[marketingWallet] = true;
            excludedFromFees[teamWallet] = true;
        }
        
        function _transfer(address sender, address recipient, uint256 amount) internal override {
            require(amount > 0, "Transfer amount must be greater than zero");
                    
            
            if(!excludedFromFees[sender] && !excludedFromFees[recipient] && !swapping){
                require(launched, "Trading not active yet");
            }
    
            uint256 fee;
              
            if (swapping || excludedFromFees[sender] || excludedFromFees[recipient]) fee = 0;
             
            else{
                if(recipient == pair) fee = amount * totSellTax / 100;
                else if(sender == pair) fee = amount * totBuyTax / 100;
                else fee = 0;
            }
            
            if (swapEnabled && !swapping && sender != pair && fee > 0) swapForFees();
    
            super._transfer(sender, recipient, amount - fee);
            if(fee > 0) super._transfer(sender, address(this) ,fee);
    
            uint256 tokensForBurn = 0;
    
            tokensForBurn = fee * sellTaxes.burn / totSellTax;
    
            if(tokensForBurn > 0) {
                     super._transfer(address(this), address(0xdead), tokensForBurn);
                }
    
        }
        function swapForFees() private inSwap {
            uint256 contractBalance = balanceOf(address(this));
    
            if (contractBalance >= swapThreshold) {
    
                uint256 denominator = totSellTax * 2;
                uint256 tokensToAddLiquidityWith = contractBalance * sellTaxes.liquidity / denominator;
                uint256 toSwap = contractBalance - tokensToAddLiquidityWith;
        
                uint256 initialBalance = address(this).balance;
        
                swapTokensForETH(toSwap);
        
                uint256 deltaBalance = address(this).balance - initialBalance;
                uint256 unitBalance= deltaBalance / (denominator - sellTaxes.liquidity);
                uint256 ethToAddLiquidityWith = unitBalance * sellTaxes.liquidity;
        
                if(tokensToAddLiquidityWith > 0 && ethToAddLiquidityWith > 0){
                    addLiquidity(tokensToAddLiquidityWith, ethToAddLiquidityWith);
                }
        
                uint256 marketingAmt = unitBalance * 2 * sellTaxes.marketing;
                if(marketingAmt > 0){
                    payable(marketingWallet).sendValue(marketingAmt);
                }
                
                uint256 teamAmt = unitBalance * 2 * sellTaxes.team;
                if(teamAmt > 0){
                    payable(teamWallet).sendValue(teamAmt);
                }
                uint256 utilityAmt = unitBalance * 2 * sellTaxes.utility;
                if(utilityAmt > 0){
                    payable(teamWallet).sendValue(utilityAmt);
                }       
    
            }
        }
    
        function swapTokensForETH(uint256 tokenAmount) private {
            address[] memory path = new address[](2);
            path[0] = address(this);
            path[1] = router.WETH();
    
            _approve(address(this), address(router), tokenAmount);
    
            // make the swap
            router.swapExactTokensForETHSupportingFeeOnTransferTokens(tokenAmount, 0, path, address(this), block.timestamp);
        }
    
        function addLiquidity(uint256 tokenAmount, uint256 bnbAmount) private {
            // approve token transfer to cover all possible scenarios
            _approve(address(this), address(router), tokenAmount);
    
            // add the liquidity
            router.addLiquidityETH{value: bnbAmount}(
                address(this),
                tokenAmount,
                0, // slippage is unavoidable
                0, // slippage is unavoidable
                address(0xdead),
                block.timestamp
            );
        }
        function setSwapEnabled(bool state) external onlyOwner { // to be used only in case of dire emergency
            swapEnabled = state;
            emit SwapEnabled();
        }
    
        function setSwapThreshold(uint256 new_amount) external onlyOwner {
            require(new_amount >= 10000, "Swap amount cannot be lower than 0.001% total supply.");
            require(new_amount <= 30000000, "Swap amount cannot be higher than 3% total supply.");
            swapThreshold = new_amount * (10**18);
            emit SwapThresholdUpdated();
        }
    
        function launch() external onlyOwner{
            require(!launched, "Trading already active");
            launched = true;
            swapEnabled = true;
            emit Launched();
        }
    
        function setBuyTaxes(uint256 _marketing, uint256 _liquidity, uint256 _team, uint256 _utility, uint256 _burn) external onlyOwner{
            buyTaxes = Taxes(_marketing, _liquidity, _team, _utility, _burn);
            totBuyTax = _marketing + _liquidity + _team + _utility + _burn;
            require(totBuyTax <= 45,"Total buy fees cannot be greater than 5%");
            emit BuyTaxesUpdated();
        }
    
        function setSellTaxes(uint256 _marketing, uint256 _liquidity, uint256 _team, uint256 _utility, uint256 _burn) external onlyOwner{
            sellTaxes = Taxes(_marketing, _liquidity, _team, _utility, _burn);
            totSellTax = _marketing + _liquidity + _team + _utility + _burn;
            require(totSellTax <= 45,"Total sell fees cannot be greater than 5%");
            require(totSellTax >= 1,"Total sell fees cannot beless  than 1%");
            emit SellTaxesUpdated();
        }
        
        function setMarketingWallet(address newWallet) external onlyOwner{
            excludedFromFees[marketingWallet] = false;
            require(newWallet != address(0), "Marketing Wallet cannot be zero address");
            marketingWallet = newWallet;
            emit MarketingWalletUpdated();     
        }
       
        function setteamWallet(address newWallet) external onlyOwner{
            excludedFromFees[teamWallet] = false;
            require(newWallet != address(0), "team Wallet cannot be zero address");
            teamWallet = newWallet;
            emit teamWalletUpdated();
        }
    
    
        function setExcludedFromFees(address _address, bool state) external onlyOwner {
            excludedFromFees[_address] = state;
            emit ExcludedFromFeesUpdated();
        }
    
    
        function withdrawStuckTokens(address _token, address _to) external onlyOwner returns (bool _sent) {
            uint256 _contractBalance = IERC20(_token).balanceOf(address(this));
            _sent = IERC20(_token).transfer(_to, _contractBalance);
            emit TransferForeignToken(_token, _contractBalance);
        }
    
        function clearStuckEthers(uint256 amountPercentage) external onlyOwner {
            uint256 amountETH = address(this).balance;
            payable(msg.sender).transfer((amountETH * amountPercentage) / 100);
            emit StuckEthersCleared();
        }
    
        function unclog() public onlyOwner lockSwapping {
            swapTokensForETH(
                balanceOf(address(this))
            );
    
            uint256 ethBalance = address(this).balance;
            uint256 ethMarketing = ethBalance / 2;
            uint256 ethteam = ethBalance - ethMarketing;
    
            bool success;
            (success, ) = address(marketingWallet).call{value: ethMarketing}("");
    
            (success, ) = address(teamWallet).call{value: ethteam}(
                ""
            );
        }
    
        // fallbacks
        receive() external payable {}
    }

