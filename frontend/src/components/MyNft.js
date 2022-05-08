import React,{useEffect,useState} from 'react'
import { Row, Col, Card} from 'react-bootstrap'
import {ArrowClockwise} from'react-bootstrap-icons'
const style={
  cardImage:{
    objectFit: 'cover'
}
}

export default function MyNft({account, contract}) {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [update, setUpdate] = useState(0);
  const forceUpdate=()=>setUpdate(value => value + 1);
  useEffect(() => {
    const loadMyNft=async()=>{
      const token = await contract.methods.getTokens().call({from:account});
      console.log(token);
      const collection = await Promise.all(token.map(async(i)=>{
        const uri = await contract.methods.tokenURI(i).call({from:account});
        console.log(uri);
        const response = await fetch(uri);
        console.log(response);
        const metadata = await response.json();
        console.log(metadata);
        let collect = {
          name : metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        return collect;
      }))
      setCollections(collection);
    }
    loadMyNft();
   setLoading(false);
  },[contract,update])

  if(loading)
    return(
      <h5>Loading.....</h5>
    )
  else
  return (
    <div className="flex justify-center">
      <h4 style={{display:'inline'}}>My NFT list:</h4>
      <button className="btn btn-light" onClick={forceUpdate}> <ArrowClockwise></ArrowClockwise></button>
      {collections.length>0?
      <div className="px-5 container">
      <Row xs={1} md={2} lg={4}  className="g-4 py-5">
      {collections.map((item, index) => (
          <Col key={index} className="overflow-hidden">
           <Card bg='dark' text='white'>
             <Card.Img variant="top" src={item.image} style={style.cardImage} />
             <Card.Body>
               <Card.Title>{item.name}</Card.Title>
               <Card.Text>
                   {item.description}
               </Card.Text>
             </Card.Body>
           </Card>
         </Col>)
      )}
      </Row>
      </div> : <h5>No purchases</h5>}
    </div>
  )
}
