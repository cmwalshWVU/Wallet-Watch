import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function CollapsableRow(props: any) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
      console.log("opening")
    setOpen(!open);
  };

  return (
      <>
        <TableRow className={open ? "selected collapsablerow" : "collapsablerow"} key={props.index} onClick={handleClick}>
            <TableCell style={{verticalAlign: 'top'}}>
                <div className={"acccount-name-flex"}>
                    {open ? <ExpandLess className={"collapseIcon"} /> :  <ExpandMore className={"collapseIcon"} />}    
                    {props.row.account}
                </div>
            </TableCell>
            <TableCell style={{verticalAlign: 'top'}}>{props.row.totalAvailable}</TableCell>
            <TableCell style={{verticalAlign: 'top'}}>{props.row.totalCurrent}</TableCell>
        </TableRow>
        {open ? 
        <TableRow className={'collapsedTable'}>
            <TableCell colSpan={3}>
            <List className={"collapsedRow"} component="div">
                <ListItem >
                    {props.columnsHeaders.map((header:any, index: number) => (
                        <ListItemText className={`1header ${index === 0 ? "leadHeader" : ""} ${header.field}`} primary={header.title} />
                        // <div className={`header ${header.field}`}>
                        //     {header.title}
                        // </div>
                    ))}
                </ListItem>
                {props.row.balances.map((row:any, index: number) => (
                    <ListItem className={`${index !== props.row.balances.length-1 ? "notLastRow" : ""} row`}>
                        {props.columnsHeaders.map((header: any) => (
                            <ListItemText className={`1cell ${header.field}`} primary={row[header.field]} />
                        ))}
                    </ListItem>
                ))}
            </List> </TableCell></TableRow>: null}
        {/*  */}
    </>
  );
}