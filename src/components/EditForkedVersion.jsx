// /src/components/EditForkedVersion.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';

import auth from '../services/authService';
import versionService from '../services/versionService';

class EditForkedVersion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentVersion: {},
            id: -1,
            author: {},
            description: '',
            contents: '',
            sentences: [],
            entryPoint: {
                parentSentenceId: -1,
                childSentenceId: -1
            },
            isValidForm: true
        }        
        this.handleContentsChange = this.handleContentsChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.checkIfValidForm = this.checkIfValidForm.bind(this);
        this.getEntryPoint = this.getEntryPoint.bind(this);
    }

    async componentDidMount() {
        if (auth.getCurrentUser()) {
            const { key } = this.props.match.params;
            const { data: version } = await versionService.getVersion(key);

            const parentVersionId = version.parentVersionId;
            const { data: parentVersion } = await versionService.getVersion(parentVersionId);
            this.setState({ parentVersion });

            const { id, author, sentences } = version;
            this.setState({ id, author, sentences });            

            let description = version.description;
            this.setState({ description });

            let contents = '';
            version.sentences.map((s, i) => {
                if (i !== 0) {
                    contents += ' ';
                }
                contents += s.contents;
                return s;
            });
            this.setState({ contents });

            this.setState({ entryPoint: this.getEntryPoint(sentences) });
        }
    }
    
    handleDescriptionChange (event) {
        this.setState({ description: event.target.value });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    handleContentsChange(event) {
        this.setState({ contents: event.target.value });

        const arraySplit = event.target.value.split('.');
        const arrayTrim = arraySplit.map(s => s.trim());
        const arrayNotEmpty = arrayTrim.filter(s => s.length > 0);
        const arrayWithPeriod = arrayNotEmpty.map(s => s + '.');
        const arraySentences = arrayWithPeriod.map(s => {
            let json = {
                contents: '',
                authorId: auth.getCurrentUser().id,
                isDraft: true,
                nexts: []
            }
            json['contents'] = s;
            return json;
        });
        console.log({ arraySentences: arraySentences });
        const entryPoint = this.getEntryPoint(arraySentences);
        const sentences = arraySentences.map((sentence, index) => {
            if (index < entryPoint.childSentenceId) {
                return this.state.parentVersion.sentences[index];
            }
            return sentence;
        });
        this.setState({ sentences });
        this.setState({ isValidForm: this.checkIfValidForm() });
        this.setState({ entryPoint });
    }

    getEntryPoint(sentences) {
        const parentSentences = this.state.parentVersion.sentences;
        let entryPoint = {
            parentSentenceId: -1,
            childSentenceId: -1
        }
        for (let i = 1; i < sentences.length; i++) {
            for (let j = 0; j < parentSentences.length; j++) {
                const isChild = sentences[i - 1].contents === parentSentences[j].contents;
                const isNew = sentences[i].isDraft === true;
                if (isChild && isNew) {
                    if (j > entryPoint.parentSentenceId)
                        entryPoint.parentSentenceId = j;
                    entryPoint.childSentenceId = i;
                }
            }
        }
        return entryPoint;
    }

    checkIfValidForm() {
        const isInvalidForm =
            this.state.description.length === 0 ||
            this.state.sentences.length === 0 ||
            this.state.entryPoint.parentSentenceId === -1;
        console.log({ isInvalidForm: isInvalidForm });
        return !isInvalidForm;
    }

    async handleSave(event) {
        event.preventDefault();
        console.log({ entryPoint: this.state.entryPoint });
        const version = {
            id: this.state.id,
            title: this.state.parentVersion.title,
            author: this.state.author,
            parentVersionId: this.state.parentVersion.id,
            isDraft: true,
            sentences: this.state.sentences,
            description: this.state.description
        }
        console.log({ version: version });
        await versionService.saveVersion(version);
        this.props.history.replace('/profile');
    }

    async handlePublish(event) {
        event.preventDefault();
        const sentences = this.state.sentences.map(sentence => {
            sentence.isDraft = false;
            return sentence;
            }
        );
        const version = {
            id: this.state.id,
            title: this.state.parentVersion.title,
            author: this.state.author,
            parentVersionId: this.state.parentVersion.id,
            isDraft: false,
            sentences: sentences,
            description: this.state.description
        }
        await versionService.saveVersion(version);

        const { parentVersion, entryPoint } = this.state;
        console.log({entryPoint: entryPoint});
        const parentSentences = parentVersion.sentences.map((s, i) => {
            if(i === entryPoint.parentSentenceId) {
                const next = {
                    nextVersionId: version.id,
                    nextSentenceContents: version.sentences[entryPoint.childSentenceId].contents
                }
                s.nexts.push(next);
            }
            return s;
        });
        console.log({parentSentences: parentSentences});
        delete parentVersion.sentences;
        parentVersion.sentences = parentSentences;
        await versionService.saveVersion(parentVersion);

        this.props.history.replace('/profile');

    }

    render() {
        if (!auth.getCurrentUser()) {
            return <Redirect to="/" />
        }
        const { parentVersion } = this.state;
        if (!parentVersion.title || !parentVersion.author) {
            return null;
        }
        return (
            <div>
                <h3>New Version</h3>
                <h4>{parentVersion.title.name} (by {parentVersion.author.username})</h4>
                <Form>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"                            
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="contents">Synopsis</Label>
                        <Input
                            type="textarea"
                            name="contents"
                            id="contents"
                            placeholder="Synopsis"
                            value={this.state.contents}
                            onChange={this.handleContentsChange}
                        />
                        <FormText>
                            The Synopsis is a collection of sentences, each ending with a period.
                        </FormText>
                    </FormGroup>
                    <br />
                    <Button
                        color="primary"
                        onClick={this.handleSave}
                        disabled={!this.state.isValidForm}
                    >
                        Save As Draft
                    </Button>
                    {' '}
                    <Button
                        color="warning"
                        onClick={this.handlePublish}
                        disabled={!this.state.isValidForm}
                    >Publish</Button>
                </Form>
            </div>
        );
    }
}

export default EditForkedVersion;