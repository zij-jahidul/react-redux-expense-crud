import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getTransactions, addTransaction, deleteTransaction, editTransaction
} from "./transactionApi";

const initialState = {
    transactions: [],
    isError: false,
    isLoading: false,
    error: '',
    editing: {}
};

// async thunk
export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
    const transactions = await getTransactions();

    return transactions;
});

export const createTransaction = createAsyncThunk('transactions/createTransaction', async (data) => {
    const transactions = await addTransaction(data);

    return transactions;
});

export const changeTransaction = createAsyncThunk('transactions/changeTransaction', async ({ id, data }) => {
    const transactions = await editTransaction(id, data);

    return transactions;
});

export const removeTransaction = createAsyncThunk('transactions/removeTransaction', async (id) => {
    const transactions = await deleteTransaction(id);

    return transactions;
});

// create slice
const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        editActive: (state, action) => {
            state.editing = action.payload;
        },
        editInActive: (state) => {
            state.editing = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
                state.transactions = [];
            })

            // create
            .addCase(createTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.transactions.push(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })

            // update
            .addCase(changeTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(changeTransaction.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;

                const indexToUpdate = state.transactions.findIndex(t => t.id === action.payload.id);

                state.transactions[indexToUpdate] = action.payload;
            })
            .addCase(changeTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })

            // delete
            .addCase(removeTransaction.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = false;

                state.transactions = state.transactions.filter(t => t.id !== action.meta.arg);
            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error?.message;
            })
    }
});

export default transactionSlice.reducer;
export const { editActive,editInActive} = transactionSlice.actions;

