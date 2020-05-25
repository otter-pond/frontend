import {Elements} from "react-stripe-elements";
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, Alert} from "reactstrap";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";

class ReportEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueAnswer: "",
            descriptionAnswers: [],
            invalid: false
        }

        for (let index in props.form.descriptionQuestions) {
            this.state.descriptionAnswers[index] = null
        }
    }

    reset() {
        let descriptionAnswers = []
        for (let index in this.props.form.descriptionQuestions) {
            this.state.descriptionAnswers[index] = null
        }
        this.setState({
            valueAnswer: "",
            descriptionAnswers: descriptionAnswers,
            invalid: false
        })
    }

    close() {
        if (this.props.toggle) {
            this.props.toggle()
            this.reset();
        }
    }

    submit() {
        if (this.state.valueAnswer == null || this.state.valueAnswer === "") {
            this.setState({
                invalid: true
            });
            return
        }
        for (var index in this.state.descriptionAnswers) {
            if (this.state.descriptionAnswers[index] == null || this.state.descriptionAnswers[index] === "") {
                this.setState({
                    invalid: true
                });
                return
            }
        }
        if (this.props.submit) {
            this.props.submit({
                value: this.state.valueAnswer,
                descriptionQuestionAnswers: this.state.descriptionAnswers
            })
        }
        this.close();
    }

    valueChange(e) {
        let value = e.target.value;
        this.setState({
            valueAnswer: value
        })
    }

    descriptionChange(e, index) {
        let answer = e.target.value;
        let allAnswers = this.state.descriptionAnswers;
        allAnswers[index] = answer
        this.setState({
            descriptionAnswers: allAnswers
        })
    }

    render() {
        return (
            <div>

                <Modal isOpen={this.props.isOpen} backdrop={true}>
                    <ModalHeader tag={"h2"}>New Report Entry</ModalHeader>
                    <Form>

                    <ModalBody>
                        <FormGroup>
                            <Label>{this.props.form.valueQuestion}</Label>
                            <Input type={this.props.valueAnswerType} name={"valueAnswer"}
                                   value={this.state.valueAnswer}
                                   onChange={e => {this.valueChange(e)}}
                                   required={true}/>
                        </FormGroup>
                        {this.props.form.descriptionQuestions.map((value, index) => {
                            return <FormGroup key={index}>
                                <Label>{value.question}</Label>
                                <Input type={value.answerType} name={"descriptionAnswer" + index}
                                       value={this.state.descriptionAnswers[index]}
                                       onChange={e => {this.descriptionChange(e, index)}}
                                       required={true}/>
                            </FormGroup>
                        })}
                        <Alert color="danger" isOpen={this.state.invalid} toggle={() => {this.setState({invalid: false})}}>
                            Invalid report entry. All questions are required.
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <div className="clearfix" style={{width: "100%"}}>
                            <Button color="secondary" className="float-right" style={{marginLeft: "10px"}} onClick={() => {this.submit()}}>Submit</Button>
                            <Button color="danger" className="float-right" onClick={() => {this.close()}}>Close</Button>
                        </div>
                    </ModalFooter>
                    </Form>

                </Modal>
            </div>
        );
    }

}

export default ReportEntryForm;