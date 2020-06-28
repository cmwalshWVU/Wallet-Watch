import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { IonToolbar, IonContent, IonPage, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonButton, IonIcon, IonSearchbar, IonRefresher, IonRefresherContent, IonToast, IonModal, IonHeader, getConfig, IonFabButton, IonFab, IonItem, IonList, IonLabel, IonCard } from '@ionic/react';
import './SchedulePage.scss'
import './Accounts.scss'
import {  deleteAccount, dispatchAddAccount, createAssetReport, getAssetReport, setTransactionsLoading, setBalancesLoading, setAccountsLoading, addNewAccount, getFirebaseAccounts } from "../data/store/actions/accountActions";
import { logoutUser} from "../data/store/actions/authActions";
import { RouteComponentProps, withRouter } from 'react-router';
import PlaidLink from "react-plaid-link";
import { add, trash } from "ionicons/icons"
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess';
import RefreshRounded from '@material-ui/icons/RefreshRounded';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Paper } from '@material-ui/core';
import MaterialTable from "material-table"; // https://mbrn.github.io/material-table/#/
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import CollapsableRow from "../components/CollapsableRow"
import axios from "axios";
import BalanceChart from '../components/BalanceChart';
import TransactionChart from '../components/TransactionChart';
import { groupBy } from '../helpers/plaidHelpers';
import { GET_ACCOUNTS, GET_TRANSACTIONS, GET_BALANCES } from '../data/store/actions/types';

interface OwnProps extends RouteComponentProps {}

interface StateProps {

  mode: 'ios' | 'md';
  plaid: any;
  isAuthenticated: any
}


type AccountsPageProps = OwnProps & StateProps;

const AccountsPage: React.FC<AccountsPageProps> = ({ history }) => {
  
    const mode = getConfig()!.get('mode')
    const accounts = useSelector((state: any) => state.plaid.accounts)
    const balances = useSelector((state: any) => state.plaid.balances)
    const transactions = useSelector((state: any) => state.plaid.transactions)

    const [segment, setSegment] = useState<'balances' | 'transactions'>('balances');
    const [accountsOpen, setaccountsOpen] = useState(true);
    const [secondChartIndex, setSecondChartIndex] = useState(-1);
    const firebaseUser = useSelector((state: any) =>  state.auth.firebaseUser)
    const dispatch = useDispatch()

    const loadAccounts = () => {
      getFirebaseAccounts().then((res: any) => {
        console.log(`success ${res}`)
        dispatch({
            type: GET_ACCOUNTS,
            payload: res
          })
       }).catch((err:any) => console.log(err))
    }

    useEffect(() => {
      // Update the document title using the browser API
      if (firebaseUser) {
        dispatch(setAccountsLoading());
        loadAccounts()
      } else {
        history.push("login")
      }
    }, [firebaseUser]);
    
    const loadTransactions = () => {
      // dispatch(setTransactionsLoading());
        axios
        .post("https://wallet-watch-server.herokuapp.com/api/plaid/accounts/transactions", accounts)
        .then(res =>
            dispatch({
                type: GET_TRANSACTIONS,
                payload: res.data
            })
        )
        .catch(err =>
            console.log(err)
        );
    }

    const loadBalances = () => {
      axios
      .post("https://wallet-watch-server.herokuapp.com/api/plaid/accounts/balances", accounts)
      .then(res => {
          dispatch({
              type: GET_BALANCES,
              payload: res.data
          })
      }
      )
      .catch(err => {
          console.log("error")
          dispatch({
              type: GET_BALANCES,
              payload: []
          })
      });
    }

    useEffect(() => {
        // Update the document title using the browser API
        dispatch(setTransactionsLoading());
        loadTransactions()

        dispatch(setBalancesLoading());
        loadBalances()


    }, [accounts.length]);

    // Add account
    const handleOnSuccess = async (token: any, metadata: any) => {
        const plaidData = {
        public_token: token,
        metadata: metadata,
        accounts: accounts
        };
        const newAccount = await addNewAccount(plaidData)
        if (newAccount) {
          await dispatchAddAccount(accounts, newAccount);
          // await getAccounts();
            // await getTransactions(accounts);
            // await getBalances(accounts)
        }
    };

    const handleOnExit = () => {
        console.log("Calling exit")
    };
        
    const refresh = async () => {
      loadAccounts()
      loadBalances()
      loadTransactions()
    }

    const onDeleteClick = (id: any) => {
        const accountData = {
        id: id,
        accounts: accounts
        };
        dispatch(deleteAccount(accountData));
    };

    const setSecondChart = (index: number) => {
        // console.log(index)
        // console.log(secondChartIndex)

        console.log(`${index} : ${secondChartIndex} : ${index === secondChartIndex}`)
        if (index === secondChartIndex) {
        setSecondChartIndex(-1)
        } else {
        console.log("SETTING TO "  + index)
        setSecondChartIndex(index)
        }
    }
  
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    const override = css`
        display: block;
        margin: 25px auto;
        size: 5px;
        width: 60px;
        height: 60px;
        border-color: red;
    `;
  
    let accountItems = accounts ? accounts.map((account:any, index: number) => (
        <IonItem className={index === 0 ? "first" : ""} key={account.itemId} style={{ marginTop: "1rem" }}>
            <IonIcon className={"delete-account"} onClick={() => onDeleteClick(account.itemId)} icon={trash} />
            <IonLabel>{account.institutionName}</IonLabel>
        </IonItem>
    )) : [];

    const transactionsColumns: {title:string, field: string, type? : "boolean" | "time" | "date" | "currency" | "numeric" | "datetime" | undefined, defaultGroupOrder?: number, defaultGroupSort?: "desc" | "asc" | undefined  }[] = [
        { title: "Date", field: "date", type: "date", defaultGroupSort: "desc" },
        { title: "Name", field: "name" },
        { title: "Amount", field: "amount" },
        { title: "Account", field: "account", defaultGroupOrder: 0 },
        { title: "Category", field: "category", defaultGroupOrder: 0 }

    ];

    let totalTransactions: any[] = []
    let transactionsData: any[] = [];
    transactions.forEach(function(account: any) {
        account.transactions.forEach(function(transaction: any) {
            transactionsData.push({
                account: account.accountName,
                date: transaction.date,
                category: transaction.category[0],
                name: transaction.name,
                amount: formatter.format(transaction.amount)
            });
            totalTransactions.push(transaction);
        });
    });

    const balanceSubTableColumns = [
        { title: "Account Name", field: "officialName", defaultSort: "desc"  },
        { title: "Balance", field: "currentBalance" },
        { title: "Available", field: "availableBalance" }

    ];

    const balanceColumns = [
        { title: "Account", field: "account", defaultSort: "desc"  },
        { title: "Current Balance", field: "totalCurrent" },
        { title: "Total Available", field: "totalAvailable" }
    ];
    let balanceData: any[] = []
    var numberOfAccounts = 0;
    var totalBalance = 0;
    var availableBalance = 0;
    let totalBalances: any[] = []

    balances.forEach(function(account: any) {
        let acct: any[] = []
        let accountName = "";
        let totalAvailable = 0;
        let totalCurrent = 0;
        account.forEach(function(account: any) {
            totalBalances.push(account)
            accountName = account.accountName ;
            totalCurrent += account.currentBalance;
            totalAvailable += account.availableBalance;            
            numberOfAccounts++;
            acct.push({
                account: account.accountName,
                accountType: account.accountType,
                currentBalance: formatter.format(account.currentBalance),
                availableBalance: formatter.format(account.availableBalance),
                limit: formatter.format(account.limit),
                currency: account.currency,
                officialName: account.officialName ? account.officialName : account.accountType
            });
        });
        totalBalance += totalAvailable;
        availableBalance += totalCurrent
        balanceData.push({
            account: accountName,
            totalCurrent: formatter.format(totalCurrent),
            totalAvailable: formatter.format(totalAvailable),
            balances: acct})
    });
    var balancesByAccount = totalBalances.length > 0 ? groupBy(totalBalances, 'accountName') : []

    const availableBalancesTotals = () => {
      let totals = []
      for (var account in balancesByAccount) {
        // console.log(account)
          let t = balancesByAccount[account].reduce(function(prev: number, cur: any) {
              return prev + cur.availableBalance;
            }, 0);
          totals.push(t)
          // console.log(t)
      }
      // console.log(totals)
      return totals
  }

  const currentBalancesTotals = () => {
      let totals = []
      for (var account in balancesByAccount) {
          let t = balancesByAccount[account].reduce(function(prev: number, cur: any) {
              return prev + cur.currentBalance;
            }, 0);
          totals.push(t)
          // console.log(t)
      }
      // console.log(totals)
      return totals
  }

    return (
    <IonPage id="accounts-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonSegment onIonChange={(e) => setSegment(e.detail.value as any)}>
            <IonSegmentButton value="balances" checked={segment === 'balances'}>
              Balances
            </IonSegmentButton>
            <IonSegmentButton value="transactions" checked={segment === 'transactions'}>
              Transactions
            </IonSegmentButton>
          </IonSegment>

          <IonButtons slot="end">
            <RefreshRounded className={"refresh-icon"} onClick={() => refresh()} />    
          </IonButtons>
        </IonToolbar>    
      </IonHeader>


      <IonContent>
          <div className={"transactions"}>
        <div className="flex about-info">
            <div className="accounts-header flex ion-padding-start" onClick={() => setaccountsOpen(!accountsOpen)}>
                Accounts ({accounts !== null ? accounts.length : 0})
                {accountsOpen ? <ExpandLess className={""} /> :  <ExpandMore className={""} />}
            </div>
        </div>
        <Collapse in={accountsOpen} timeout="auto" unmountOnExit>
            <div className="accounts-title">
              Add or remove your bank accounts below
            </div>
            <IonList className={"accounts"}>
                {accountItems}
            </IonList>
        </Collapse>

        { segment === "transactions" ?
        <div className={"table"}>
              <p className="transactions-totals">
                You have <b>{transactionsData.length}</b> transactions from your
                <b> {accounts !== null ? accounts.length : 0}</b> linked
                {(accounts === null || accounts.length) > 1 ? (
                  <span> accounts </span>
                ) : (
                  <span> account </span>
                )}
                from the past 30 days
              </p>
              <div>
                <TransactionChart />
                {/* <TransactionChart transactionsByCategory={transactionsByCategory} transactionsByCategoryTotals={transactionsByCategoryTotals()} /> */}
              </div>
              <IonCard>
                <MaterialTable
                  columns={transactionsColumns}
                  data={transactionsData}
                  title="Search Transactions"
                  options={{
                    grouping: true,
                    sorting: true
                  }}
                />
              </IonCard>
            </div>
            : 
            <div className={"table"}>
            <p className="balances-totals">
              You have <b>{numberOfAccounts}</b> accounts from
              <b> {balances.length}</b> linked institutions
            </p>
            <div className={""}>
              <div className="flex">
                <BalanceChart title={"Balances"} availableBalancesTotals={availableBalancesTotals()} currentBalancesTotals={currentBalancesTotals()}  />
              </div>
            </div>
              <IonCard className={"balancesCard"} >
                <div className={"cardHeader"} >
                  <div> Balances </div>
                  <Paper elevation={2} className={"totals primary"}>
                  <div >
                    <div className={"balance"}>
                      <div className={"title black-text"}>Available:</div>
                      <div className={"amount"}>{formatter.format(totalBalance)} </div>
                      </div>
                    <div className={"balance"}>
                      <div className={"title black-text"}>Balance:</div>
                      <div className={"amount"}>{formatter.format(availableBalance)} </div>
                    </div>
                  </div>
                  </Paper>
                </div>
                <Table>
                  <TableHead>
                  <TableRow>
                    {balanceColumns.map((header: any, index) => (
                      <TableCell
                        className={index === 0 ? 'leadHeader' : ""}
                        key={header.id}
                        align={'left'}
                        padding={'default'}
                      >
                        {header.title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody >
                {
                  balanceData.length > 0 ? balanceData.map((balance, index) => (
                    <CollapsableRow index={index} lastRow={index === balanceData.length-1} tableHeaders={balanceColumns}  row={balance} columnsHeaders={balanceSubTableColumns} />
                  ))
                : 
                <TableRow className={'collapsedTable'}>
                  <TableCell colSpan={3}>
                    <ClipLoader
                    css={override}
                    size={150}
                    //size={"150px"} this also works
                    color={"#339989"}
                    loading={true}
                  />
                  </TableCell>
                  </TableRow>
                }
                </TableBody>
              </Table>
            </IonCard>
          </div>
        }
        </div>
      </IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <PlaidLink
                  clientName="React Plaid Setup"
                  env="sandbox"
                  product={["auth", "transactions", "assets"]}
                  publicKey="38f7e03470bc3fd786112f2042901f"
                  onExit={handleOnExit}
                  onSuccess={handleOnSuccess}
                  className={"plaid-buttons"}
                  >
          <IonFabButton>  
              <IonIcon icon={add} />
          </IonFabButton>
          </PlaidLink>
      </IonFab>
    </IonPage>
  );
};

export default withRouter(React.memo(AccountsPage))