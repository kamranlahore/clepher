import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import apiClient from "../../services/api";
import apiRequests from "../../services/apiRequests";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

const styles2 = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  backdrop: {
    zIndex: +1,
    color: "#fff",
  },

  alignLeft: {
    fontSize: "65px",
  },
};
const useStyles = makeStyles(styles, styles2);

export default function Users(props) {
  const columns = [
    { title: "id", field: "id", hidden: true },
    {
      title: "Sr.#",
      field: "tableData.id",
      render: (rowData) => {
        return rowData.tableData.id + 1;
      },
    },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Role", field: "role" },
    { title: "Status", field: "status" },
    {
      title: "Courses",
      field: "tableData.id",
      render: (rowData) => {
        // /sections/course/:id
        var user_courses_link = "/admin/user-courses/" + rowData.id;
        return <Link to={user_courses_link}>Courses</Link>;
      },
    },
  ];

  const classes = useStyles();
  const history = useHistory();

  // Get user id from URL for edit and delete
  // let { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    apiClient.get(apiRequests.sanctumCsrfCookie).then((response) => {
      apiClient
        .get(apiRequests.getAllUsers)
        .then((response) => {
          setData(response.data.data);
          setLoading("");
        })
        .catch((error) => {
          window.location.reload();
        });
    });
  }, []);

  // Delete record
  const handleRowDelete = (oldData, resolve) => {
    setLoading(true);

    apiClient.get(apiRequests.sanctumCsrfCookie).then((response) => {
      apiClient
        .post(apiRequests.deleteUser, {
          id: oldData.id,
        })
        .then((response) => {
          setLoading(false);
          // alert(12);
          if (response.status === 200) {
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            // const index = oldData.tableData.id;
            setLoading(false);

            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            resolve();
            setSuccess(response.data.message);
          }
        })
        .catch((error) => {
          // alert(34);

          setLoading(false);
          setSuccess("");
          setErrorMessages([error.response.data.message]);
          setIserror(true);
          resolve();
        });
    });
  };

  // Redirect to the Edit form
  const handleRowEdit = (userid) => {
    return history.push("/admin/user/" + userid);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              Users Listing
              <AddBoxIcon
                onClick={() => history.push("/admin/user")}
                style={{ fontSize: 30, float: "right", cursor: "pointer" }}
              />
            </h4>
          </CardHeader>
          <CardBody>
            <div className={classes.tableResponsive}>
              <MaterialTable
                title=""
                columns={columns}
                data={data}
                isLoading={loading ? true : false}
                editable={{
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      handleRowDelete(oldData, resolve);
                    }),
                }}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit User",
                    onClick: (event, rowData) => handleRowEdit(rowData.id),
                  },
                ]}
                options={{
                  pageSize: 10,
                  actionsColumnIndex: -1,
                  pageSizeOptions: [10, 50, 100, 500],
                }}
              />

            </div>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

Users.defaultProps = {
  tableHeaderColor: "gray",
};

Users.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
