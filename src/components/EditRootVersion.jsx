// /src/components/EditRootVersion.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import auth from '../services/authService';
import versionService from '../services/versionService';

import EditSentence from './EditSentence';

class EditRootVersion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: {}
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
    }

    async componentDidMount() {
        const { key: id } = this.props.match.params;
        const { data: version } = await versionService.getVersion(id);
        this.setState({ version });
    }

    handleDelete (index) {
        const version = { ...this.state.version };
        const sentences = version.sentences.filter((s, i) => i !== index);
        delete version.sentences;
        version.sentences = sentences;
        this.setState({ version });
    }

    handleChange (event) {        
        const index = Number.parseInt(event.currentTarget.name);
        const version = { ...this.state.version };
        const newSentence = {
            contents: event.currentTarget.value,
            isDraft: true,
            authorId: auth.getCurrentUser().id,
            nexts: []
        }
        const sentences = version.sentences.map((s, i) => {
            if (i !== index) {
                return s;
            }
            return newSentence;
        });        
        delete version.sentences;
        version.sentences = sentences;
        this.setState({ version });
    }

    handleAdd (index) {
        const version = { ...this.state.version };
        const sentences = [];
        const newSentence = {
            contents: 'Your text.',
            isDraft: true,
            authorId: auth.getCurrentUser().id,
            nexts: []
        }
        version.sentences.map((s, i) => {
            sentences.push(s);
            if(i === index ) {                
                sentences.push(newSentence);                
            }
            return s;            
        })
        delete version.sentences;
        version.sentences = sentences;
        this.setState({ version });
    }

    async handleSave (event) {
        event.preventDefault();
        const version = {...this.state.version};
        try {
            await versionService.saveVersion(version);
            this.props.history.replace('/profile');
        }
        catch(ex) {
            console.log(ex);
        }
    }

    async handlePublish (event) {
        event.preventDefault();
        const version = {...this.state.version};
        const sentences = version.sentences.map(sentence => {
            sentence.isDraft = false;
            return sentence;
            }
        );
        version.isDraft = false;
        delete version.sentences;
        version.sentences = sentences;
        await versionService.saveVersion(version);
        this.props.history.replace('/profile');
    }

    render() {
        const { version } = this.state;
        if (!version || !version.sentences) {
            return null;
        }
        const sentencesList = version.sentences.map((sentence, index) => {
            return (
                <EditSentence
                    key={index}
                    index={index}
                    sentence={sentence}
                    handleDelete={this.handleDelete}
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd}
                />
            );
        })
        return (
            <div>
                <h3>Editing a Root Version</h3>
                <h4>{version.title.name}</h4>
                {sentencesList}
                <br />
                <Button
                    color="info"
                    tag={Link}
                    to="/profile"
                >Cancel</Button>
                {' '}
                <Button
                    color="primary"
                    onClick={this.handleSave}
                >Save As Draft</Button>
                {' '}
                <Button
                    color="warning"
                    onClick={this.handlePublish}
                >Publish</Button>
            </div>
        );
    }
}

export default EditRootVersion;