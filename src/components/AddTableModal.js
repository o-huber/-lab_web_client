import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {React, Component} from "react";
import {createTable} from "../services/TablesServices";
import types from "../constants/types";
import Select from '@material-ui/core/Select';
import {FormControl} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ErrorSnackbar from "./ErrorSnackbar";

class AddTableModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            table_name: '',
            columns: [{
                column: 'id',
                type: undefined
            }],
            columnComponents: [],
            error: undefined
        }
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    componentDidMount() {
        this.setState({columnComponents: [this.renderColumn(0)]});
    }

    extractErrorMessage(message) {
        let mes = '';
        if (Array.isArray(message.columns)) {
            for (let m of message.columns) {
                if(typeof m === 'object' && m !== null) {
                    const key = Object.keys(m)
                    mes = `${key} is ${m[key].toLowerCase()}`;
                }
            }
        } else return message;
        return mes;
    }

    async createTable() {
        const {db} = this.props;
        let response = await createTable(db, this.state.table_name, this.state.columns);
        if (!response.success) {
            this.setState({error: <ErrorSnackbar open={true} message={this.extractErrorMessage(response?.message)}/>});
        } else {
            this.handleClose();
            this.props.fetchList();
        }
    }

    handleClose() {
        this.props.onOpenChange(false);
    }

    renderColumn(i) {
        return (<div style={{
            display: 'flex', justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            <TextField
                color="default"
                autoFocus
                margin="dense"
                type="name"
                label="Name"
                style={{display: 'flex', width: '150px'}}
                defaultValue={this.state.columns[i]?.column || ''}
                onChange={(event) => {
                    const updatedColumns = [...this.state.columns];
                    updatedColumns[i] ? updatedColumns[i].column = event.target.value : (updatedColumns.push({column: event.target.value}));
                    this.setState({columns: updatedColumns});
                }}
            />
            <FormControl style={{width: '150px', display: 'flex'}}>
                <InputLabel id="category-select">Type</InputLabel>
                <Select
                    labelId="subject-select"
                    id="subject-select"
                    value={this.state.columns[i]?.type}
                    onChange={(event) => this.handleTypeChange(event, i)}
                >
                    {types.map((type) => (
                        <MenuItem value={type}>{type}</MenuItem>
                    ))}

                </Select>
            </FormControl>
        </div>)
    }

    handleTypeChange = (event, i) => {
        const updatedColumns = [...this.state.columns];
        updatedColumns[i] ? updatedColumns[i].type = event.target.value : (updatedColumns.push({type: event.target.value}));
        this.setState({columns: updatedColumns});
    };

    renderColumns() {
        let columns = <div> {this.state.columnComponents} <Button
            onClick={() => {
                const updatedColumnComponents = [...this.state.columnComponents];
                updatedColumnComponents.push(this.renderColumn(this.state.columnComponents.length));
                this.setState({columnComponents: updatedColumnComponents});
            }}><AddBoxOutlinedIcon/> Add column</Button></div>
        return (columns);
    }

    renderCreateTableModal() {
        return (
            <Dialog open={this.props.open} onClose={() => this.handleClose()}
                    aria-labelledby="form-dialog-title">
                <DialogTitle style={{width: '550px'}} id="form-dialog-title">
                    <p style={{fontSize: '18px'}}> Create table</p>
                </DialogTitle>
                <DialogContent style={{width: '550px'}}>
                    <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around'}}>
                        <TextField
                            color="default"
                            autoFocus
                            margin="dense"
                            type="name"
                            label="Name"
                            style={{display: 'flex', width: '300px'}}
                            onChange={(event) => this.setState({table_name: event.target.value})}
                        />
                        <p style={{display: 'flex'}}>Database: {this.props.db}</p></div>
                    <p style={{
                        marginLeft: '35px'
                    }}>Columns</p>
                    {this.renderColumns()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.createTable()} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>)
    }

    render() {
        return (<> {this.state.error}{
            this.renderCreateTableModal()
        }</>)
    }

}

export default AddTableModal;
