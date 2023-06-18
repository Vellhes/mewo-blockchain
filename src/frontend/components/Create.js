import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Buffer } from "buffer";
//import { create as ipfsHttpClient } from 'ipfs-http-client'
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const ipfsClient = require("ipfs-http-client");

const projectId = "2RKcc8YzE5U2V1uFAuZF13XjbK3";
const projectSecret = "c8d45edbd290332321cc34b3d769e066";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// client.pin.add("QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn").then((res) => {
// console.log(res);
// });

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.io/ipfs/${result.path}`)
      } catch (error) {
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try {
      const result = await client.add(JSON.stringify({ image, price, name, description }))
      mintThenList(result)
    } catch (error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.io/ipfs/${result.path}`
    // mint nft 
    await (await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <h1>Création d'un NFT</h1>
          <div className="content mx-auto">
            <Row>
              <Col>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={uploadToIPFS}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control onChange={(e) => setName(e.target.value)} required type="text" placeholder="Nom" />
              </Col>
              <Col>
                <Form.Control onChange={(e) => setPrice(e.target.value)} required type="number" placeholder="Prix en ETH" />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control onChange={(e) => setDescription(e.target.value)} required as="textarea" placeholder="Description" />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-grid px-0">
                  <Button onClick={createNFT} variant="primary" className="metamask_button">
                    Créer votre NFT
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Create