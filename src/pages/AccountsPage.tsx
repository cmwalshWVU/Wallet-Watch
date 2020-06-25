import React, { useEffect, useState, useRef } from 'react';
import { IonToolbar, IonContent, IonPage, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonButton, IonIcon, IonSearchbar, IonRefresher, IonRefresherContent, IonToast, IonModal, IonHeader, getConfig, IonFabButton, IonFab, IonItem, IonList, IonLabel, IonCard } from '@ionic/react';
import { connect } from '../data/connect';
import { options } from 'ionicons/icons';
import './SchedulePage.scss'
import './Accounts.scss'
import * as selectors from '../data/selectors';
import { getAccounts, getTransactions, getBalances, addAccount, deleteAccount, dispatchAddAccount, createAssetReport, getAssetReport } from "../data/store/actions/accountActions";
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
import setAuthToken from '../utils/setAuthToken';
import BalanceChart from '../components/BalanceChart';
import TransactionChart from '../components/TransactionChart';

interface OwnProps extends RouteComponentProps {}

interface StateProps {

  mode: 'ios' | 'md';
  plaid: any;
  isAuthenticated: any
}

interface DispatchProps {
  logoutUser: typeof logoutUser;
  getTransactions: typeof getTransactions;
  getBalances: typeof  getBalances;
  addAccount: typeof addAccount;
  deleteAccount: typeof deleteAccount;
  getAccounts: typeof getAccounts;
  createAssetReport: typeof createAssetReport;
  getAssetReport: typeof getAssetReport;

}

type AccountsPageProps = OwnProps & StateProps & DispatchProps;

const AccountsPage: React.FC<AccountsPageProps> = ({ createAssetReport, getAssetReport, isAuthenticated, plaid, getTransactions, getBalances, getAccounts, history, deleteAccount, mode }) => {
  const [segment, setSegment] = useState<'balances' | 'transactions'>('balances');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const [showCompleteToast, setShowCompleteToast] = useState(false);
  const [accountsOpen, setaccountsOpen] = useState(true);
  const [secondChartIndex, setSecondChartIndex] = useState(-1);
  const [secondChartAvail, setSecondChartAvail] = useState([])
  const [secondChartCurr, setSecondChartCurr] = useState([])
  const [secondChartCol, setSecondChartCol] = useState([])
  const [secondTitle, setSecondTitle] = useState("")

  useEffect(() => {
    console.log(secondChartIndex)
    setSecondChartIndex(secondChartIndex)
    setSecondChartCol(getSecondChartData("accountType"))
    setSecondChartCurr(getSecondChartData("availableBalance"))
    setSecondChartAvail(getSecondChartData("currentBalance"))
    let i = 0
    for (var x in balancesByAccount) {
      if (i === secondChartIndex) {
        setSecondTitle(x)
      }
      i++
    }
  }, [secondChartIndex]);

  useEffect(() => {
    if (!isAuthenticated) {
        history.push('/', {direction: 'none'});
    } 
    console.log("calling get accounts")
    // getAccounts()
    // Update the document title using the browser API
    const { accounts } = plaid;
    getTransactions(accounts);
    getBalances(accounts)
  }, [isAuthenticated, plaid.accounts.length]);
  
  const { accounts, balances, balancesLoading, transactions, accountsLoading } = plaid;

  // Add account
  const handleOnSuccess = async (token: any, metadata: any) => {
    const plaidData = {
      public_token: token,
      metadata: metadata,
      accounts: accounts
    };
    axios.post("/api/plaid/accounts/add", plaidData)
      .then(async res => {
        await dispatchAddAccount(accounts, res.data);
        await getAccounts();
        await getTransactions(accounts);

        await getBalances(accounts)
      })

  };

  const handleOnExit = () => {
    console.log("Calling exit")
  };
    
  const refresh = async () => {
    // console.log(localStorage.getItem("jwtToken"))
    // await setAuthToken(localStorage.getItem("jwtToken"));
    // getAccounts()
    const { accounts } = plaid;
    getTransactions(accounts);
    getBalances(accounts);
    createAssetReport(accounts);
  }


  const getAssetReportButton = async () => {
    const { accounts, assetReportId } = plaid;
    getAssetReport(accounts, assetReportId)
  }

 const onDeleteClick = (id: any) => {
    const { accounts } = plaid;
    const accountData = {
      id: id,
      accounts: accounts
    };
    deleteAccount(accountData);
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
    <IonItem className={index === 0 ? "first" : ""} key={account._id} style={{ marginTop: "1rem" }}>
        <IonIcon className={"delete-account"} onClick={() => onDeleteClick(account._id)} icon={trash} />
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


  function groupBy(arr: any[], property: any) {
    return arr.reduce(function(memo: any, x: any) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  var transactionsByCategory = groupBy(totalTransactions, 'category')


  const transactionsByCategoryTotals = () => {
    let totals = []
    for (var transaction in transactionsByCategory) {
      let t = transactionsByCategory[transaction].reduce(function(prev: number, cur: any) {
        return prev + cur.amount;
      }, 0);
      totals.push(t)
    }
    // console.log(totals)
    return totals
  }
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
    
  const getSecondChartData = (prop: string) => {
    if( secondChartIndex !== -1 ) {
      let i = 0
      for (var x in balancesByAccount) {
        if (i === secondChartIndex) {
          // console.log(balancesByAccount[x])
          if (prop === "accountType") {
            return groupBy(balancesByAccount[x], 'accountType')
          } else {
            return balancesByAccount[x].map((it: any) => it[prop] + Math.random() * 1000)
          }
        }
        i++
      }
      return []
    }
  }

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

export default withRouter(connect<OwnProps & RouteComponentProps, StateProps, DispatchProps>({
    mapStateToProps: (state) => ({
      mode: getConfig()!.get('mode'),
      plaid: state.plaid,
      isAuthenticated: state.auth.isAuthenticated
    }),
    mapDispatchToProps: {
      getAssetReport, createAssetReport, getAccounts, logoutUser, getTransactions, getBalances, addAccount, deleteAccount 
    },
    component: React.memo(AccountsPage)
  }));