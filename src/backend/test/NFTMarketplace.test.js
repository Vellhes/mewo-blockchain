const { expect } = require("chai");
const { formatEther } = require("ethers/lib/utils");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function(){
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "Sample URI"
    beforeEach(async function(){
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        
        [deployer, addr1, addr2] = await ethers.getSigners();
    
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deploiement", function(){
        it("Doit vérifier le nom et le symbole de la collection de NFT", async function(){
            expect( await nft.name()).to.equal("Duss NFT");
            expect( await nft.symbol()).to.equal("duss");
        })
    })
    describe("Minter les NFTs", function(){
        it("Doit tracket chaque NFT minté", async function(){
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
    describe("Création des nft du marketplace", function(){
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })
        it("ne doit pas fonctionner si le prix est égal à 0", async function(){
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("le prix doit etre superieur a 0");
        })
    })
    describe("Achat des objets du marketplace", function (){
        let price = 2;
        let totalPriceInWei;
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price))
        })
        it("Ne doit pas fonctionner pour des id non valides, si l'objet est vendu ou si l'acheteur n'a pas assez d'ether ", async function(){
            totalPriceInWei = await marketplace.getTotalPrice(1);
            await expect(
                marketplace.connect(addr2).purchaseItem(2, {value : totalPriceInWei})
            ).to.be.revertedWith("L'objet n'existe pas");
            await expect(
                marketplace.connect(addr2).purchaseItem(2, {value : totalPriceInWei})
            ).to.be.revertedWith("L'objet n'existe pas");
            await expect(
                marketplace.connect(addr2).purchaseItem(1, {value : toWei(price )})
            ).to.be.revertedWith("Vous n'avez pas assez d'ether pour acheter cet objet")
            await marketplace.connect(addr2).purchaseItem(1 , {value : totalPriceInWei})
            await expect(
                marketplace.connect(deployer).purchaseItem(1 , {value : totalPriceInWei})
            ).to.be.revertedWith("L'objet a deja ete vendu")
        })
    })
})