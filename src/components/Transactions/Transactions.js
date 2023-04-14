import Transaction from "./Transaction";
import { useDispatch,useSelector } from "react-redux";
import { fetchTransactions } from '../../features/transaction/transactionSlice';
import { useEffect } from "react";

export default function Transactions() {
    const {transactions, isLoading, isError } = useSelector(state => state.transaction);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTransactions())
    }, [dispatch]);


    //decide what to render
    let content = null;
    if (isLoading) content = <p>Loading...</p>;
    if (!isLoading && isError) content = <p className="error">There was an error occured.</p>;
    if (!isLoading && !isError && transactions?.length > 0) {
        content = transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
    }
    if (!isLoading && !isError && transactions?.length === 0) {
        content = <p className="error">No Transactions found!</p>;
    }

    return (
        <>
            <p className="second_heading">Your Transactions:</p>

            <div className="conatiner_of_list_of_transactions">
                <ul>
                    {content}
                </ul>
            </div>
        </>
    );
}
