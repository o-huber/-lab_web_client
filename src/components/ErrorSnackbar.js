import React, {Component} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


class ErrorSnackbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {
        this.setState({open: true})
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    render() {
        return (
            <div>
                <Snackbar open={this.state.open} autoHideDuration={2500} onClose={this.handleClose}
                          message={this.props.message}>
                    <MuiAlert elevation={6} variant="filled" severity="error">
                        {this.props.message}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}

export default ErrorSnackbar;
