/*
* Copyright (c) 2017-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

import * as React from 'react';
import * as Radium from 'radium';
import {connect} from 'react-redux';
import {createStructuredSelector, Selector} from 'reselect';
import {Col, Row, Select, Form, Spinner} from 'src/components/ReusableComponents';
import {GenericFooter} from 'src/components/GenericFooter';
import {LabeledInput} from 'src/components/LabeledInput';
import {ISelectFormat, CSS} from 'src/interfaces';
import {store} from 'src/store';
import {genericHandleClick, shouldRenderSpinner} from 'src/utils';
import {facilityGroupSchema} from 'src/validationSchemas';
import {genericActionToInvokeSaga, setFormData} from 'src/actions';
import {getFormData} from 'src/selectors';
import {FG_CREATE_SUCCESS, FG_UPDATE_SUCCESS, FG_UPDATE_ERROR, FG_CREATE_ERROR} from 'src/constants';
import {
    GET_FACILITY_GROUP_INSTANCE,
    UPDATE_FACILITY_GROUP,
    CREATE_FACILITY_GROUP
} from 'src/containers/FacilityGroup/actionTypes';
import {
    ERROR_TEXT_COLOR,
    formStyle,
    menuContainerStyle,
    labelStyle,
    autoCompleteStyle,
    selectContainerStyle
} from 'src/constants/palette';

export interface IFacilityGroupFormData {
    id?: string;
    name?: string;
    status?: string;
}

export interface IFacilityGroupFormProps {
    id?: string;
    formData?: IFacilityGroupFormData;
    isCreate?: boolean;
    onDeleteClicked?: () => void;
}

export interface IFacilityGroupFormState {
    error: {
        name?: string;
        status?: string;
    };
}

@Radium
export class FacilityGroupFormImpl extends React.Component<IFacilityGroupFormProps, IFacilityGroupFormState> {

    constructor() {
        super();
        this.state = {
            error: {
                name: '',
                status: ''
            }
        };
    }

    componentWillMount() {
        if (!this.props.isCreate) {
            store.dispatch(genericActionToInvokeSaga(GET_FACILITY_GROUP_INSTANCE, this.props.id));
        }
    }

    handleInputChange = (e: React.ChangeEvent<{}>): void => {
        this.setError('name');
        store.dispatch(setFormData({name: e.target[`value`]}));
    }

    handleDropdownChange = (newStatus: ISelectFormat): void => {
        this.setError('status');
        store.dispatch(setFormData({status: newStatus.value}));
    }

    renderFooter = (): JSX.Element => {
        const {isCreate, onDeleteClicked} = this.props;

        return (
            isCreate
                ? <GenericFooter isCreate onCreateClicked={(): void => this.handleClick(true)} />
                : <GenericFooter onEditClicked={(): void => this.handleClick()} onDeleteClicked={onDeleteClicked}/>
        );
    }

    setError = (path: string, message: string = ''): void => {
        this.setState((prevState: IFacilityGroupFormState) => {
            return {
                ...prevState,
                error: {
                    [path]: message
                }
            };
        });
    }

    handleClick = (isCreate: boolean= false): void => {
        const actionType: string = isCreate ? CREATE_FACILITY_GROUP : UPDATE_FACILITY_GROUP;
        const successMessage: string = isCreate ? FG_CREATE_SUCCESS : FG_UPDATE_SUCCESS;
        const errorMessage: string = isCreate ? FG_CREATE_ERROR : FG_UPDATE_ERROR;
        const facilityGroupId: string = isCreate ? '' : this.props.id;

        genericHandleClick(
                this.props.formData,
                facilityGroupSchema,
                actionType,
                successMessage,
                errorMessage,
                facilityGroupId,
                '/facility-group/list',
                this.setError
        );
    }

    render(): JSX.Element {
        const {isCreate, formData} = this.props;
        const {error} = this.state;

        if (shouldRenderSpinner(formData, isCreate, 'name')) {
            return <Spinner />;
        }

        return (
            <div>
                <Form style={formStyle}>
                    <Row>
                        <Col xs={12} md={8}>
                            <LabeledInput
                                    id="facilityGroupName"
                                    value={formData.name}
                                    onChange={this.handleInputChange}
                                    label="Name"
                                    placeholder="Enter facility group name"
                            />
                            <span style={errorStyle}>{error.name}</span>
                        </Col>

                        <Col xs={12} md={6}>
                            <div style={selectContainerStyle}>
                                <h3 style={labelStyle}>Status</h3>
                                <Select
                                        clearable={false}
                                        searchable={false}
                                        placeholder="Select Status"
                                        onChange={this.handleDropdownChange}
                                        menuContainerStyle={menuContainerStyle}
                                        value={formData.status}
                                        style={autoCompleteStyle}
                                        options={[
                                            {label: 'Active', value: 'Active'},
                                            {label: 'Inactive', value: 'Inactive'},
                                            {label: 'Mark as deleted', value: 'Deleted'}
                                        ]}
                                />
                            </div>
                            <span style={errorStyle}>{error.status}</span>
                        </Col>
                    </Row>
                </Form>
                {this.renderFooter()}
            </div>
        );
    }
}

const mapStateToProps: Selector<Map<string, Object>, IFacilityGroupFormProps> = createStructuredSelector({
    formData: getFormData(),
});

export const FacilityGroupForm: React.ComponentClass<IFacilityGroupFormProps> =
        connect(mapStateToProps)(FacilityGroupFormImpl);

const errorStyle: CSS = {
    color: ERROR_TEXT_COLOR
};
