pragma solidity ^0.4.24;

//version controll
// contract ContractVersion {

//     address manager;
//     address currentAddress;

//     mapping(string => address) versions;

//     modifier onlyManager() {
//         require(msg.sender == manager);
//         _;
//     }

//     constructor() public {
//         manager = msg.sender;
//     }

//     function getManager() public view returns(address) {
//         return manager;
//     }

//     function deploy(string _version) public onlyManager{
//         address newContract = new ParrentAddress(msg.sender);
//         versions[_version] = newContract;
//         setCurrentVersion(_version);
//     }

//     function setCurrentVersion(string _version) internal {
//         currentAddress = versions[_version];
//     }

//     function getAddressOf(string _version) public view returns(address) {
//         return versions[_version];
//     }

//     function getCurrentAddress() public view returns(address) {
//         return currentAddress;
//     }

// }


//parrent address
contract ParrentAddress {

  mapping(address => uint) balanceOf;
  address manager;

  event eventCharge(address chargeAddr);
  event eventPutForward(address putForwardAddr, uint value);

  constructor() public {
    manager = msg.sender;
  }

  function transfer(address _to, uint _value) external {
    require(balanceOf[msg.sender] >= _value);
    require(balanceOf[_to] + _value > balanceOf[_to]);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
  }

  modifier onlyManager() {
    require(msg.sender == manager);
    _;
  }

  function getManager() public view returns(address) {
    return manager;
  }

  function getTotalBalance() onlyManager external view returns(uint){
    return address(this).balance;
  }

  function getBalanceOf(address _addr) public view returns(uint){
    return balanceOf[_addr];
  }

  function charge() external payable {
    require(msg.value > 0);
    require(balanceOf[msg.sender] + msg.value > balanceOf[msg.sender]);
    balanceOf[msg.sender] += msg.value;
    emit eventCharge(msg.sender);
  }

  function charge(address _to, uint estimateGas) external payable {
    require(msg.value > estimateGas);
    balanceOf[_to] += (msg.value - estimateGas);
    emit eventCharge(msg.sender);
  }

  function putForward(address _to, uint _getValue) external {
    require(balanceOf[msg.sender] >= _getValue);
    balanceOf[msg.sender] -= _getValue;
    _to.transfer(_getValue);
    emit eventPutForward(msg.sender, _getValue);
  }

}
