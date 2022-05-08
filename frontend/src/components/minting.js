import React,{useState, useEffect} from 'react'
import { Form, Button, Row } from 'react-bootstrap'
import {create} from 'ipfs-http-client'
const client = create('https://ipfs.infura.io:5001/api/v0');


export default function Minting({account,contract}) {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  }, [loading])
  
  
  const upload= async(event)=>{
    event.preventDefault();
    // console.log(event.target.files);
    const file = event.target.files[0];
    if(file !== undefined){
      try{
        const result = await client.add(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
        console.log(await contract.methods.tokenCount().call({from:account}));
      }catch(error){
        console.log("IPFS upload error:",error);
      }
    }
  }

  const uploadMetadata=async()=>{
      if(image && name && description){
        setLoading(true);
        try{
          const result = await client.add(JSON.stringify({name,image,description}));
          console.log(result);
          const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
          await contract.methods.mint(uri).send({from: account});
          setName('');
          setDescription('');
        }catch(error){
          console.log("Error:",error);
        }
      }else{
        alert("Fill all the Details and then Submit");
      }
      setLoading(false);
  }

  return (
    <div className='col-md-5 mx-auto my-3'>
    <Form>
      <Row className="g-2">
        <Form.Control
          type="file"
          required
          name="file"
          onChange={upload}
        />
        <Form.Control type="text" value={name} placeholder="Enter the name of NFT" onChange={(e)=>
          setName(e.target.value)}/>
        <Form.Control as="textarea" value={description} placeholder="Description of NFT" onChange={(e)=> setDescription(e.target.value)}/>
      <Button disabled={loading} variant="primary" onClick={uploadMetadata}>
        {!loading?'Mint':'Minting....'}
      </Button>
  </Row>
</Form>
</div>
  )
}
