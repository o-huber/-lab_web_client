import {React, Component} from 'react';
import {IconButton, Typography} from "@mui/material";
import {getColumns, renameColumn} from "../services/ColumnsServices";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TextField from "@material-ui/core/TextField";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MoreVertIcon from "@material-ui/icons/MoreVert"
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import equal from 'fast-deep-equal'
import ErrorSnackbar from "./ErrorSnackbar";

class Columns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            anchorEl: undefined,
            open: false,
            newName: undefined,
            database: '',
            table: '',
            error: undefined
        }

        this.openRename = this.openRename.bind(this);
    }

    async fetchColumns() {
        let response = await getColumns(this.state.database, this.state.table);
        if (response.success) {
            this.setState({columns: response.data.columns});
        }
    }

    async componentDidMount() {
        this.setState({database: this.props.match.params.database});
        this.setState({table: this.props.match.params.table});
        await this.fetchColumns();
    }

    columnName;

    handleMoreButton(event, columnName) {
        this.columnName = columnName;
        this.setState({anchorEl: event.currentTarget});
    }

    handleCloseMoreButton = () => {
        this.setState({anchorEl: null});
    };

    openRename() {
        this.handleCloseMoreButton();
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({
            open: false,
            newName: undefined,
        });
    };

    extractErrorMessage(message) {
        let mes = '';
        if (Array.isArray(message.columns)) {
            for (let m of message.columns) {
                if (typeof m === 'object' && m !== null) {
                    const key = Object.keys(m)
                    mes = `${key} is ${m[key].toLowerCase()}`;
                }
            }
        } else return message;
        return mes;
    }

    async renameColumn() {
        let response = await renameColumn(this.state.database, this.state.table, this.columnName, this.state.newName);
        if (response.success) {
            await this.fetchColumns();
            this.handleClose();
        } else {
            this.setState({error: <ErrorSnackbar open={true} message={this.extractErrorMessage(response?.message)}/>});
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.database !== prevState.database || nextProps.match.params.table !== prevState.table) {
            return {

                database: nextProps.match.params.database,
                table: nextProps.match.params.table

            }
        }
        return null;
    }

    async componentDidUpdate(prevProps) {
        if (!equal(this.props.match.params.database, prevProps.match.params.database) || !equal(this.props.match.params.table, prevProps.match.params.table)) {
            this.setState({
                database: this.props.match.params.database,
                table: this.props.match.params.table
            })
            await this.fetchColumns();
        }
    }

    renderRenameDialog() {
        return (<Dialog open={this.state.open} onClose={() => this.handleClose()}>
            <DialogTitle id="form-dialog-title">Rename</DialogTitle>
            <DialogContent style={{width: '400px', height: '150px'}}>
                <TextField
                    margin="dense"
                    id="name"
                    label="New name"
                    fullWidth
                    required
                    inputProps={{maxLength: 255}}
                    defaultValue={this.columnName}
                    onChange={(event) => this.setState({newName: event.target.value})}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => this.handleClose()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => this.renameColumn()} color="primary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>)
    }

    render() {
        return (<div style={{width: '100%', margin: '10px'}}>
            {this.renderRenameDialog()}
            <Typography>Columns:</Typography>
            {this.state.error}
            <div>
                <Typography>Table: {this.state.table}</Typography>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <TableContainer component={Paper} style={{width: '50%'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell style={{width: '50px'}}/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.columns.map((col) => (
                                    <TableRow
                                        key={col.column}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell>{col.column}</TableCell>
                                        <TableCell>{col.type}</TableCell>
                                        <TableCell style={{width: '50px'}} align="right"><IconButton
                                            onClick={(event) => this.handleMoreButton(event, col.column)}><MoreVertIcon/></IconButton></TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleCloseMoreButton}
                    >
                        <MenuItem key="rename" selected={'Rename'}
                                  onClick={this.openRename}>
                            Rename
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </div>)
    }
}

export default Columns;
