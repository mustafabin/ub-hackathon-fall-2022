import "../styles/Detail.scss";
import { useEffect, useState } from "react";
import contract from "./nft.json";
import { ethers } from "ethers";
import "../styles/MarketItem.scss";
import coinLogo from "../assets/mozam-logo.png";
import Divider from '@mui/material/Divider';

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const contractAddress = "0x355638a4eCcb777794257f22f50c289d4189F245";
const abi = contract.abi;
const Detail = ({ setOpenModal, setIsMining }) => {
	const navigate = useNavigate();
	const [product, setProduct] = useState({});
	const [seller, setSeller] = useState({});
	const [currentAccount, setCurrentAccount] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:3000/products/${window.location.href.match(/\d+$/)[0]}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((result) => {
				// console.log("result", result);
				if (result.error) {
					// FAILED
					Swal.fire(data["error"], data["message"], "error");
				} else {
					// success
					setProduct(result);
					console.log("result", result);
					setSeller(result.user);
				}
			});
	}, []);

	const checkWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			Swal.fire('Error', "Please install Metamask!", 'error')
			return;
		} else {
			console.log("Wallet exists! We're ready to go!");
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account: ", account);
			setCurrentAccount(account);
		} else {
			console.log("No authorized account found");
		}
	};

	const connectWalletHandler = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			Swal.fire('Error', "Please install Metamask!", 'error')

		}

		try {
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			console.log("Found an account! Address: ", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (err) {
			console.log(err);
		}
	};

	const mintNftHandler = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const nftContract = new ethers.Contract(contractAddress, abi, signer);

				console.log("Initialize payment");
				let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.000000001") });

				console.log("Mining... please wait");
				setIsMining(true);
				setOpenModal(true);
				await nftTxn.wait();
				setIsMining(false);
				setOpenModal(false);

				Swal.fire("Minted Successfully 👷🏽!", `See transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`, "success");
				let product_id = window.location.href.match(/\d+$/)[0];
				fetch("http://localhost:3000/complete-order", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"super-token": localStorage.getItem("token"),
					},
					body: JSON.stringify({
						product_id,
					}),
				})
					.then((response) => response.json())
					.then((result) => {
						// console.log("result", result);
						if (result.error) {
							// FAILED
						} else {
							// success
							navigate("/market");
							console.log("result", result);
						}
					});
			} else {
				console.log("Ethereum object does not exist");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const connectWalletButton = () => {
		return (
			<button onClick={connectWalletHandler} className="second">
				Connect Wallet
			</button>
		);
	};

	const mintNftButton = () => {
		return (
			<button className="second" onClick={mintNftHandler}>
				Buy
			</button>
		);
	};

	useEffect(() => {
		checkWalletIsConnected();
	}, []);

	return (
		<div className="detail">

			<div className="detail-image">
				
				{!product.image_url ?<img src={"https://static.dezeen.com/uploads/2019/02/new-zara-logo-hero-1.jpg"} alt={product.name} />:<img src={product.image_url} alt="product" />}
				<div className="detail-image-child">
					<p>Description:</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum volutpat velit sollicitudin aliquam. Proin
						turpis dolor, suscipit ut eros quis, commodo dictum urna.
					</p>
				</div>
			</div>
			<div className="detail-details">
				<div className="detail-title">
					<h1>{product.name}</h1>
					<p>{seller.display_name}</p>
					<div className="detail-price">
						<img src={coinLogo} alt="coin" />
						<p style={{ fontSize: "larger", marginLeft: "20px" }}>
							{product.price} <span>MOZ</span>
						</p>
					</div>
				</div>
				{currentAccount ? mintNftButton() : connectWalletButton()}

				<button
					className="first"
					onClick={() => {
						let product_id = window.location.href.match(/\d+$/)[0];
						fetch("http://localhost:3000/create-room", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
								"super-token": localStorage.getItem("token"),
							},
							body: JSON.stringify({
								product_uuid: product_id,
								seller_email: seller.email,
							}),
						})
							.then((response) => response.json())
							.then((result) => {
								// console.log("result", result);
								if (result.error) {
									// FAILED
									Swal.fire("400 Error", `Please login and try again, error detail : ${result.error} `, "error");
								} else {
									// success
									navigate(`/chat/${result.id}`);
								}
							});
					}}>
					Message Seller
				</button>
			</div>

		</div>
	);
};
export default Detail;
