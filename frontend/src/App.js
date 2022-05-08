import React,{ useState } from 'react';
import { Navbar, Button, Container} from 'react-bootstrap';
import Web3 from 'web3';
import NFT from './contracts/NFT.json'
import Minting from './components/minting';
import MyNft from './components/MyNft';

function App() {
  const [web3Api, setWeb3Api] = useState({web3:null, contract:null});  
  const [account, setAccount] = useState(null);
  const [flag, setFlag] = useState(false);
  const address = process.env.REACT_APP_ADDRESS;
  
  return (
    <div>
  <Navbar bg="dark" variant='dark'>
  <Container fluid>
    {console.log(address)}
    <Navbar.Brand >NFT Wallet</Navbar.Brand>
      <Button
      variant="outline-warning"
      disabled={account}
      onClick={async()=>{
        if(window.ethereum){
          let provider = window.ethereum;
          try{
            let web3 = new Web3(provider);
            let contract = new web3.eth.Contract(NFT.abi,address);
            setWeb3Api({web3,contract});
          }catch(error){
            console.error(error);
          }
          alert("Successfully Connected to Metamask");
          let accounts = await window.ethereum.request({method:'eth_requestAccounts'});
          // console.log(accounts);
          setAccount(accounts[0]);
          setFlag(true);
        }else{
          alert("Please install Metamask");
        }}}>
      {!account?'Connect':account}
    </Button>
    </Container>
  </Navbar>
  {flag?
    <div>
      <Minting account={account} contract={web3Api.contract}/>
      <MyNft account={account} contract={web3Api.contract}/>
    </div>:<div className="text-center my-5">
    <h3>Connect to Metamask</h3>
    </div>}
  </div> 
  );
}

export default App;
