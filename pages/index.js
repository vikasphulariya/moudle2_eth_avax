import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [TokenName, setSetTokenName] = useState(undefined);
  const [tokenSymbol, setTokenSymbol] = useState(undefined);
  const [constracAddress, setContractAddress] = useState("");
  const [tokenstoMint, setTokenstoMint] = useState(undefined);
  const [tokenstoBurn, setTokenstoBurn] = useState(undefined);
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async (contractAddress) => {


    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getContract(contractAddress);
  };

  const getContract = (contractAddress) => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getInfo = async ()=>{
    setTokenSymbol(await atm.symbol())
    setSetTokenName(await atm.name())

  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.totalSupply()).toNumber());
    }
  }

  const Minter = async () => {
    if (tokenstoMint <= 0 || tokenstoMint === undefined) {
      alert("Please enter a Valid")
    }
    else {
      let tx = await atm.mint(tokenstoMint);
      await tx.wait()
      getBalance();
      setTokenstoMint("");
      // console.log("Balance")
    }
  }
  const Burner = async () => {
           
    if (tokenstoBurn <= 0 || tokenstoBurn === undefined) {
      alert("Please enter a Valid")
    }
    else {
      let tx = await atm.burn(tokenstoBurn);
      await tx.wait()
      getBalance();
      setTokenstoBurn("");
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {

      return (
        <div>

      <input style={{width:300}} placeholder="Enter Contract addres of deployed Contract" onChange={(e)=>{setContractAddress(e.target.value)}}></input>
      <br />
      <br />
      <button onClick={()=>{
        console.log(constracAddress.length);
        if(constracAddress.length === 42){
          
          connectAccount(constracAddress);
        }else{
          alert("Please enter valid address");
        }
        }}>Connect</button>
        </div>
      )
    }

    if (balance == undefined) {
      getInfo()
      getBalance();
    }
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Vikas Phulriya Welcomes You</h1></header>
      {tokenSymbol!==undefined?<div>
        <h2>Account Address:{account}</h2>
        <h2 onClick={async()=>{
          console.log((await atm.totalSupply()).toNumber())
          alert("xcxc")

          }}>Token Name:{TokenName}</h2>
        <h2>Token Symbol:{tokenSymbol}</h2>
        <h2>Token Supply:{balance}</h2>
        <h1>Token Minter</h1>

        <input type='number' value={tokenstoMint} onChange={(e) => { setTokenstoMint(e.target.valueAsNumber) }} style={{ padding: 10, borderWidth: 2, borderRadius: 10, width: 200 }} placeholder="Number Of Tokens to Mint"></input>
        <br />
        <br />
        <button style={{ padding: 10, borderWidth: 2, borderRadius: 10, fontWeight: 900, fontSize: 15 }}
          onClick={()=>{Minter()}}>Mint</button>
        <br />
        <br />
        <h1>Token Burner</h1>
        <input type='number' value={tokenstoBurn} onChange={(e) => { setTokenstoBurn(e.target.valueAsNumber) }} style={{ padding: 10, borderWidth: 2, borderRadius: 10, width: 200 }} placeholder="Number Of Tokens to Mint"></input>
        <br />
        <br />
        <button style={{ padding: 10, borderWidth: 2, borderRadius: 10, fontWeight: 900, fontSize: 15 }}
          onClick={async () => { Burner()}}>Burn</button>
      </div>:null}
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        };
        .inputBox{
          
        }
      `}
      </style>
    </main>
  )
}