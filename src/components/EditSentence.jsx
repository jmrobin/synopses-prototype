// /src/components/EditSentence.jsx

import React from 'react';
import { Button, Form, Input } from 'reactstrap';

import './EditSentence.css';

class EditSentence extends React.Component {
    render() {
        const { index, sentence } = this.props;
        if (sentence.isDraft) {
            return (
                <div className="card">
                    <Form>
                        <Button
                            size="sm"
                            color="danger"
                            onClick={() => this.props.handleDelete(index)}
                        >Remove</Button>
                        {' '}
                        <Button
                            size="sm"
                            color="primary"
                            onClick={() => this.props.handleAdd(index)}
                        >Add</Button>
                        <Input
                            type="textarea"
                            name={index}
                            value={sentence.contents}
                            onChange={this.props.handleChange}
                        />
                    </Form>
                </div>

            );
        }
        return (
            <div>
                This is a Published Sentence
            </div>
        );
    }
}

export default EditSentence;