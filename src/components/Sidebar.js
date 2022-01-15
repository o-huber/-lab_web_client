import {React, Component} from 'react';
import List from '@mui/material/List';

import {createDB, getDBList} from "../services/DatabaseServices";
import MenuItem from "./MenuItem";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IconButton from "@mui/material/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import ErrorSnackbar from "./ErrorSnackbar";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            db_list: [],
            error: undefined
        }
        this.fetchDBList = this.fetchDBList.bind(this);
        this.handleOpenAdd = this.handleOpenAdd.bind(this);

    }

    async componentDidMount() {
        await this.fetchDBList();
    }

    error;

    async fetchDBList() {
        let response = await getDBList();
        if (!response.success) {
            this.error = <ErrorSnackbar open={true} message={response?.message}/>;
        } else
            this.setState({db_list: response.data});
    }

    renderCreateDBModal() {
        return (
            <Dialog open={this.state.createModalOpen} onClose={() => this.handleCreateClose()}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"><p style={{fontSize: '18px'}}> Create
                    database</p>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        color="default"
                        autoFocus
                        margin="dense"
                        type="name"
                        label="Name"
                        fullWidth
                        onChange={(event) => this.setState({db_name: event.target.value})}
                    /></DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleCreateClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.createDatabase()} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>)
    }

    handleOpenAdd() {
        this.setState({createModalOpen: true}
        )
    }

    handleCreateClose() {
        this.setState({createModalOpen: false, db_name: ''}
        )
    }

    async createDatabase() {
        let response = await createDB(this.state.db_name);
        if (!response.success) {
            this.setState({error: <ErrorSnackbar open={true} message={response?.message}/>});
        } else {
            await this.fetchDBList();
            this.handleCreateClose();
        }
    }

    render() {
        return <div style={{width: '25%', backgroundColor: "#d5cfe7"}}>
            <div>{this.renderCreateDBModal()}</div>
            {this.state.error}

            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <p style={{display: 'flex'}}>Databases</p>
                <IconButton style={{display: 'flex'}} edge="end" aria-label="comments" onClick={this.handleOpenAdd}>
                    <AddBoxOutlinedIcon/>
                </IconButton>
            </div>
            <List sx={{width: '100%', maxWidth: 500}}
                  component="nav">
                {this.state.db_list.map((db) =>
                    <MenuItem name={db} fetchDB={this.fetchDBList}/>
                )}
            </List>
        </div>
    }
}

export default Sidebar;
