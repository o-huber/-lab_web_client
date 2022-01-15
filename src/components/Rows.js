import {React, Component} from 'react';
import {Typography} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {IconButton} from "@mui/material";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TableContainer from "@mui/material/TableContainer";
import {getColumns} from "../services/ColumnsServices";
import {getRows} from "../services/RowsServices";
import {AddBoxOutlined} from "@material-ui/icons";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";

class Rows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            anchorEl: undefined,
            open: false,
            database: '',
            table: ''
        }
    }

    async fetchRows() {
        let response = await getRows(this.state.database, this.state.table);
        if (response.success) {
            this.setState({rows: response.data.rows});
        }
    }

    async componentDidMount() {
        this.setState({database: this.props.match.params.database});
        this.setState({table: this.props.match.params.table});
        await this.fetchRows();
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

    render() {
        let rows = this.state.rows || [];
        return (<div style={{width: '100%', margin: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography>Rows</Typography>
                    <IconButton><AddBoxOutlinedIcon/></IconButton>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <TableContainer component={Paper} style={{width: '90%'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {rows[0] ?
                                        Object.keys(this.state.rows[0]).map((row_key) => (
                                            <>
                                                <TableCell>{row_key}</TableCell>
                                            </>
                                        )) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        {/*{Object.keys(this.state.rows[0]).map((row_key) => (*/}
                                        {/*    row_key !== 'color' ? <TableCell>{row[row_key]}</TableCell> : <TableCell>*/}
                                        {/*        <div style={{width:'5px',color: row[row_key]}}/>*/}
                                        {/*    </TableCell>))*/}
                                        {Object.keys(this.state.rows[0]).map((row_key) => (
                                            <TableCell>{row[row_key]}</TableCell>))
                                        }
                                        <TableCell style={{width: '50px'}} align="right"><IconButton
                                            onClick={(event) => this.handleMoreButton(event, row.column)}><MoreVertIcon/></IconButton></TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}

export default Rows;
