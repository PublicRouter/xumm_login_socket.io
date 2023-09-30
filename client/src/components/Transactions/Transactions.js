import "./transactions.css";
import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../../App';
import CollapsibleTree from "../CollapsibleTree/CollapsibleTree";

export default function Transactions() {
    const [accountObject] = useContext(AccountContext);
    const [transactionData, setTransactionData] = useState(null);

    useEffect(() => {
        //FETCH XRPL ACCOUNT TRANSACTIONS FROM XRPSCAN API
        async function fetchTransactionData() {
            try {
                const returnedTransactionData = await fetch(`https://api.xrpscan.com/api/v1/account/${accountObject.wallet}/transactions`);
                const returnedTransactionDataJson = await returnedTransactionData.json();
                setTransactionData(returnedTransactionDataJson);
            } catch (error) {
                console.error("Failed to fetch transaction data:", error);
            }
        }

        fetchTransactionData();
    }, [accountObject.wallet]);  // useEffect dependency to ensure fetch runs once when the component mounts and whenever accountObject.wallet changes

    return (
        <div id="transactionsPageContainer">
            <div>
                <h2 id="transactionsPageTitle">Transactions page</h2>

                <div>
                    {
                        transactionData ?
                            <div id="collapsibleTree">
                                <h4>Collapsible Transactions Tree<br /><p style={{ margin: "0px", fontWeight: "300", fontSize: "10px" }}>hover over node to see tx details, click on darker nodes to expand</p></h4>
                                <CollapsibleTree data={transactionData} />
                            </div> : null
                    }
                </div>
            </div>
        </div>
    )
};
