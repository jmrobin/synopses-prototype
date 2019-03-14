// /src/components/ReadVersion.jsx

import React from 'react'
import { Redirect, Link } from 'react-router-dom';
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu
} from 'reactstrap';

import versionService from '../services/versionService';

class ReadVersion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: {},
            dropdownOpen: []
        }
        this.toggle = this.toggle.bind(this);
    }

    async componentDidMount() {
        const { key: id } = this.props.match.params;
        const { data: version } = await versionService.getVersion(id);
        this.setState({ version, dropdownOpen: [].fill(false) });
    }

    async componentWillReceiveProps (newProps) {
        if(this.props.location.pathname !== newProps.location.pathname) {
            const { key: id } = newProps.match.params;
            const { data: version } = await versionService.getVersion(id);
            this.setState({ version, dropdownOpen: [].fill(false) });
        }
    }

    toggle(i) {
        const dropdownOpen = [...this.state.dropdownOpen];
        dropdownOpen[i] = !this.state.dropdownOpen[i];
        this.setState({ dropdownOpen });
    }
    render() {
        const { version } = this.state;
        if(version.isDraft) {
            return <Redirect to="/versions"/>
        }
        if (!version.sentences) {
            return null;
        }
        const display = version.sentences.map((sentence, index) => {
            return (
                <div key={index}>
                    {sentence.contents}
                    {' '}
                    <ButtonDropdown
                        size="sm"
                        direction="right"
                        isOpen={this.state.dropdownOpen[index]}
                        toggle={() => this.toggle(index)}
                        hidden={sentence.nexts.length > 0 ? false : true}
                    >
                        <DropdownToggle caret>
                            {sentence.nexts.length}
                        </DropdownToggle>
                        <DropdownMenu>
                            {sentence.nexts.map((n, position) => {
                                return (
                                    <DropdownItem key={position}>
                                        <Link to={'/read-version/' + n.nextVersionId}>
                                            {n.nextSentenceContents}
                                        </Link>
                                    </DropdownItem>
                                );
                            })
                            }
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
            );
        })
        return (
            <div>
                <h4>{version.title.name} by {version.author.username}</h4>
                <h5>{version.description}</h5>
                <br />
                {display}
            </div>
        );
    }
}

export default ReadVersion;