import {Component, React} from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import {dropTable, getTables} from "../services/TablesServices";
import ListItemIcon from '@mui/material/ListItemIcon';
import ViewColumnSharpIcon from '@mui/icons-material/ViewColumnSharp';
import TableRowsSharpIcon from '@mui/icons-material/TableRowsSharp';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import AddTableModal from "./AddTableModal";
import {dropDB} from "../services/DatabaseServices";
import {Link} from 'react-router-dom'
import ErrorSnackbar from "./ErrorSnackbar";

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            tables: [],
            confirmDeleteDBOpen: false,
            confirmDeleteTableOpen: false,
            db_name: '',
            openAdd: false,
            table: undefined,
            error: undefined
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleOpenAdd = this.handleOpenAdd.bind(this);
        this.handleAddOpenChange = this.handleAddOpenChange.bind(this);
        this.handleDeleteDBClose = this.handleDeleteDBClose.bind(this);
        this.handleDeleteTableConfirmation = this.handleDeleteTableConfirmation.bind(this)
        this.handleDeleteTableClose = this.handleDeleteTableClose.bind(this);
    }

    async handleClick(db) {
        this.setState((prevState => ({
            open: !prevState.open
        })));
        await this.fetchTables(db);
    }

    error;

    async fetchTables(db) {
        let response = await getTables(db);
        if (!response.success) {
            this.error = <ErrorSnackbar open={true} message={response?.error?.message}/>;
        } else
            this.setState({tables: response.data});
    }

    handleOpenAdd() {
        this.setState({openAdd: true});
    }

    handleCreateClose() {
        this.setState({openAdd: false, db_name: ''}
        )
    }

    handleAddOpenChange(open) {
        this.setState({openAdd: open});
    }

    handleDeleteDBConfirmation() {
        this.setState({confirmDeleteDBOpen: true});
    }

    handleDeleteDBClose() {
        this.setState({confirmDeleteDBOpen: false});
    }

    handleDeleteTableConfirmation(table) {
        this.setState({confirmDeleteTableOpen: true, table: table});
    }

    handleDeleteTableClose() {
        this.setState({confirmDeleteTableOpen: false});
    }

    async deleteDB() {
        let response = await dropDB(this.props.name);
        if (!response.success) {
            this.setState({error: <ErrorSnackbar open={true} message={response?.message}/>});
        } else {
            await this.props.fetchDB();
            this.handleDeleteDBClose();
        }
    }

    async deleteTable(table) {
        let response = await dropTable(this.props.name, table);
        if (!response.success) {
            //TODO: show error
        } else {
            await this.fetchTables(this.props.name);
            this.handleDeleteTableClose();
        }
    }

    renderDeleteTableConfirm() {
        return (<Dialog open={this.state.confirmDeleteTableOpen} onClose={() => this.handleDeleteTableClose()}
                        aria-labelledby="form-dialog-title">
            <DialogTitle style={{width: '250px'}} id="form-dialog-title"><p style={{fontSize: '18px'}}> Drop
                table</p>
            </DialogTitle>
            <DialogContent>
                <p>Delete the table?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDeleteTableClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => this.deleteTable(this.state.table)} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>);
    }

    renderDeleteDBConfirm() {
        return (<Dialog open={this.state.confirmDeleteDBOpen} onClose={() => this.handleDeleteDBClose()}
                        aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title"><p style={{fontSize: '18px'}}> Drop
                database</p>
            </DialogTitle>
            <DialogContent>
                <p>Delete the {this.props.name} database?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDeleteDBClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => this.deleteDB()} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>);
    }

    render() {
        return (<>
            {this.state.openAdd ?
                <AddTableModal db={this.props.name} open={this.state.openAdd} onOpenChange={this.handleAddOpenChange}
                               fetchList={() => this.fetchTables(this.props.name)}/> : null}
            {this.state.confirmDeleteTableOpen ? this.renderDeleteTableConfirm() : null}

            {this.state.confirmDeleteDBOpen ? this.renderDeleteDBConfirm() : null}
            {this.state.error}
            <ListItem secondaryAction={<>
                <IconButton edge="end" aria-label="comments" onClick={this.handleOpenAdd}>
                    <AddBoxOutlinedIcon/>
                </IconButton>
                <IconButton edge="end" aria-label="comments" onClick={this.handleDeleteDBConfirmation.bind(this)}>
                    <DeleteOutlineRoundedIcon/>
                </IconButton>
            </>
            }>
                <ListItemButton onClick={() => this.handleClick(this.props.name)} key={this.props.name}>
                    {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                    <ListItemText primary={this.props.name}/>
                </ListItemButton>
            </ListItem>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {this.state.tables.map((table) => (<>
                            <ListItem secondaryAction={
                                <IconButton edge="end" aria-label="comments"
                                            onClick={() => this.handleDeleteTableConfirmation(table)}>
                                    <DeleteOutlineRoundedIcon/>
                                </IconButton>
                            }>
                                <ListItemButton sx={{pl: 4}}>
                                    <ListItemText primary={table}/>
                                </ListItemButton>
                            </ListItem>
                            {console.log(this.props.name, table)}
                            <ListItem component={Link} to={{
                                pathname: `/${this.props.name}/${table}/columns`
                            }}>
                                <ListItemButton sx={{pl: 8}}>
                                    <ListItemIcon>
                                        <ViewColumnSharpIcon/>
                                    </ListItemIcon>
                                    <ListItemText style={{color: 'black'}} primary="Columns"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem component={Link} to={{
                                pathname: `/${this.props.name}/${table}/rows`
                            }}>
                                <ListItemButton sx={{pl: 8}}>
                                    <ListItemIcon>
                                        <TableRowsSharpIcon/>
                                    </ListItemIcon>
                                    <ListItemText style={{color: 'black'}} primary="Rows"/>
                                </ListItemButton>
                            </ListItem></>
                    ))}
                </List>
            </Collapse></>)
    }

}

export default MenuItem;
