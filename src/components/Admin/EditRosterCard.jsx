import React, { Component } from "react";
import {
  Card, CardBody, CardHeader, CardTitle, CardSubtitle, Table, UncontrolledDropdown, DropdownMenu,
  DropdownItem, DropdownToggle, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, FormText, Alert
} from "reactstrap"
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";
import LoadingOverlay from "react-loading-overlay";
import CreateUserModal from "./CreateUserModal";
import Notify from "react-notification-alert";

class EditRosterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      selectedRole: "None",
      selectedRoleId: "",
      activeUsers: [],
      loading: false,
      isDeleteModalOpen: false,
      displayInvalidEntryAlert: false,
      displayDeleteFailedAlert: false,
      deleteModalText: '',
      userToDelete: {
        first_name: '',
        last_name: '',
        user_email: ''
      },
      showCreateUser: false
    }

    this.usersClient = new UsersAPI();
    this.rolesClient = new RolesAPI();

    this.loadUsers()

    this.rolesClient.getRoles().then(roles => {
      this.setState({
        roles: roles
      });
    }).catch(e => {
      var options = {
        place: "tc",
        message: `Error executing request`,
        type: "danger",
        autoDismiss: -1,
        closeButton: true
      };
      this.refs.notify.notificationAlert(options);
    })
  }

  loadUsers() {
    this.usersClient.getUsers().then(users => {
      var userMap = {};
      users.forEach(user => {
        userMap[user["user_email"]] = user;
      });
      this.setState({
        users: userMap
      });
    }).catch(e => {
      var options = {
        place: "tc",
        message: `Error executing request`,
        type: "danger",
        autoDismiss: -1,
        closeButton: true
      };
      this.refs.notify.notificationAlert(options);
    })
  }

  setActiveRole(role_id) {
    this.setState({
      loading: true
    }, () => {
      let role = this.state.roles.filter(a => {return a.role_id === role_id})[0];
      this.rolesClient.getUsersWithRole(role_id).then(users => {
        users.sort((a,b) => (a["last_name"] > b["last_name"]) ? 1 : ((b["last_name"] > a["last_name"]) ? -1 : 0));
        this.setState({
          selectedRole: role_id !== "none" ? role["role_description"] : "Users Without Role",
          selectedRoleId: role_id,
          activeUsers: users,
          loading: false
        })
      }).catch((e) => {
        console.log("unable to load users with role: " + e);
        this.setState({
          loading: false
        })
      })
    })
  }

  dropdownSelect(event) {
    this.setState({
      selectedRole: "Loading"
    })
    this.setActiveRole(event.target.value)
  }

  renderRoleDropdown(selected, onClick) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle>
          Selected: {selected}
        </DropdownToggle>
        <DropdownMenu>
          {this.state.roles.map((role, index) => {
            return <DropdownItem value={role["role_id"]} onClick={(e) => onClick(e)} key={index}>{role["role_description"]}</DropdownItem>
          })}
          <DropdownItem value={"none"} onClick={(e) => onClick(e)}>Users Without Role</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  updateRole(newRoleId, userEmail) {
    console.log(newRoleId + userEmail);
    this.rolesClient.setUserRole(newRoleId, userEmail).then(() => {
      let users = this.state.activeUsers.filter(a => {return a !== userEmail});
      this.setState({
        activeUsers: users
      });
    }).catch(e => {
      var options = {
        place: "tc",
        message: `Error executing request`,
        type: "danger",
        autoDismiss: -1,
        closeButton: true
      };
      this.refs.notify.notificationAlert(options);
    })
  }

  openDeleteModal = user => {
    this.toggleDeleteModal();
    this.setState({
      userToDelete: user
    });
  }

  toggleDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: !this.state.isDeleteModalOpen,
      displayInvalidEntryAlert: false,
      displayDeleteFailedAlert: false,
      userToDelete: {
        first_name: '',
        last_name: '',
        user_email: ''
      }
    });
  }

  toggleInvalidEntryAlert = () => {
    this.setState({
      displayInvalidEntryAlert: !this.state.displayInvalidEntryAlert
    });
  }

  toggleDeleteFailedAlert = () => {
    this.setState({
      displayDeleteFailedAlert: !this.state.displayDeleteFailedAlert
    });
  }

  deleteUser = () => {
    // Parse modal input
    let user = this.state.userToDelete;
    let userName = user.first_name + " " + user.last_name;
    let enteredName = this.state.deleteModalText


    if (userName === enteredName) {
      if (this.state.displayInvalidEntryAlert) {
        this.toggleInvalidEntryAlert();
      }
      // Call API to delete user
      this.usersClient.deleteUser(user.user_email).then(resp => {
        // Updates UI for deleted user
        let users = { ...this.state.users }
        delete users[user['user_email']];
        this.setState({
          users
        });

        // Closes modal
        this.toggleDeleteModal();
      }).catch(e => {
        this.setState({
          displayDeleteFailedAlert: true
        });
      });
    } else {
      this.setState({
        displayInvalidEntryAlert: true,
        displayDeleteFailedAlert: false
      });
    }
  }

  createNewUser() {
    this.setState({
      showCreateUser: true
    }, () => {
      this.loadUsers()
    });
  }

  cancelCreateUser() {
    this.setState({
      showCreateUser: false
    })
  }

  render() {
    return (
      <div>
        <Notify ref="notify"/>
        <Modal isOpen={this.state.isDeleteModalOpen} toggle={this.toggleDeleteModal}>
          <ModalHeader toggle={this.toggleDeleteModal}>Confirm Deletion</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <FormText>
                  Are you sure you would like to delete user {this.state.userToDelete.first_name} {this.state.userToDelete.last_name}? To confirm, please type the user's first and last name in the box below:
                </FormText>
                <br />
                <Input
                  placeholder="Bagul DeMedici" 
                  onChange={e => { this.setState({ deleteModalText: e.target.value }); }}
                />
                <br />
                <Alert color="danger" isOpen={this.state.displayInvalidEntryAlert} toggle={this.toggleInvalidEntryAlert}>
                  Entry did not match first and last name of user
                </Alert>
                <Alert color="warning" isOpen={this.state.displayDeleteFailedAlert} toggle={this.toggleDeleteFailedAlert}>
                  Error: unable to delete user
                </Alert>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteUser}>Delete User</Button>{' '}
            <Button color="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Card>
          <CardHeader>
            <div className="clearfix">
              <CardTitle tag="h2" className="float-left">Edit Roster</CardTitle>
              <div className="float-right">
                <div className={"float-left"}>
                  <Button onClick={() => {this.createNewUser()}}>Create New</Button>
                </div>
                <div className="float-right">
                  {this.renderRoleDropdown(this.state.selectedRole, (e) => { this.dropdownSelect(e) })}
                </div>
                {/*<Button className="float-right">Change User Roles</Button>*/}
              </div>
            </div>
            <div className="float-left" hidden={this.state.selectedRole === "None"}>
              <CardSubtitle className="float-left">Roster Count: {this.state.activeUsers.length}</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            {this.state.selectedRole === "None" ?
              <h5>Select a role to edit.</h5>
              :
              <div>
                <LoadingOverlay
                  active={this.state.loading}
                  spinner
                  text='Loading...'
                >
                  <Table>
                    <thead>
                      <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Role</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.activeUsers.map((user_email, index) => {
                        let user = this.state.users[user_email];
                        if (!user)
                          return
                        return (
                          <tr key={index}>
                            <td>{user.last_name}</td>
                            <td>{user.first_name}</td>
                            <td>
                              <Input type="select" style={{ width: 200 }} value={this.state.selectedRoleId}
                                onChange={(e) => { this.updateRole(e.target.value, user_email) }}>
                                {this.state.roles.map((role, index) => {
                                  return <option value={role.role_id} key={index}>{role.role_description}</option>
                                })}
                                <option value={"none"}>No Role</option>
                              </Input>
                            </td>
                            <td>
                              <Button
                                color={"danger"}
                                onClick={() => { this.openDeleteModal(user) }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </LoadingOverlay>
              </div>
            }
            <CreateUserModal isOpen={this.state.showCreateUser} cancel={() => {this.cancelCreateUser()}} />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default EditRosterCard;
