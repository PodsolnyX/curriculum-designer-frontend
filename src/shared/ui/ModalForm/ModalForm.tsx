import {Button, DatePicker, Form, FormProps, Input, InputNumber, Modal, Select, Switch} from "antd";
import React, {ReactNode, useEffect} from "react";
import {NamePath} from "rc-field-form/lib/interface";

export interface ModalFormField<T> {
    name: NamePath<T>,
    label: string,
    isRequired?: boolean,
    inputComponent?: ModalFormInput,
    options?: OptionType[],
    customInput?: React.ReactNode
}

interface ModalFormFieldsProps<T> {
    fields: ModalFormField<T>[],
    loading?: boolean,
    title?: string,
    buttonLabel?: string,
    initialValues?: any,
    isOpen?: boolean,
    onSubmit?(data: T): void,
    onClose?(): void
}

export interface ModalProps {
    isOpen?: boolean,
    onClose?(): void
}

type ModalFormInput = "input" | "inputNumber" | "datePicker" | "switch" | "select" | "file";

type OptionType = { value: string, label: string }

export const ModalForm = <T, >(props: ModalFormFieldsProps<T>) => {

    const {
        fields,
        loading,
        buttonLabel,
        onSubmit,
        initialValues,
        isOpen,
        onClose,
        title
    } = props;

    const [form] = Form.useForm<T>();

    useEffect(() => {
        if (initialValues) form.setFieldsValue({...initialValues})
    }, [initialValues])
    const onFinish: FormProps<T>["onFinish"] = (values) => {
        onSubmit && onSubmit(values);
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title={title}
            footer={null}
        >
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={{...initialValues}}
                layout={"vertical"}
                autoComplete={"on"}
                className={"w-full"}
            >
                {
                    fields.map(field =>
                        <Form.Item<T>
                            name={field.name}
                            label={field.label}
                            rules={field.isRequired ? [{ required: true, message: 'Обязательное поле' }] : []}
                            key={field.name as string}
                            valuePropName={field.inputComponent === "switch" ? "checked" : undefined}
                        >
                            {
                                field.customInput
                                ? field.customInput
                                : field.inputComponent
                                && getFormInput(field.options)[field.inputComponent]
                            }
                        </Form.Item>
                    )
                }
                <Button htmlType={"submit"} type={"primary"} disabled={loading}>{buttonLabel}</Button>
            </Form>
        </Modal>

    )
}

function getFormInput(options?: OptionType[]): Record<ModalFormInput, ReactNode> {
    return {
        "input": <Input className={"w-full"} />,
        "inputNumber": <InputNumber className={"w-full"} />,
        "datePicker": <DatePicker className={"w-full"} />,
        "switch": <Switch/>,
        "select": <Select options={options}/>,
        "file": <Input type={"file"} className={"w-full"}/>
    }
}