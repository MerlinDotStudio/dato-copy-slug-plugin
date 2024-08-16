import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import {
    Button,
    Canvas,
    SwitchField,
    TextField,
    Form,
    FieldGroup,
} from 'datocms-react-ui';
import { Form as FormHandler, Field } from 'react-final-form';
type PropTypes = {
    ctx: RenderConfigScreenCtx;
};

type FirstInstallationParameters = {};
type ValidParameters = { forcePrefix: boolean; defaultPrefix?: string };

const validatePrefix = (value?: string) => {
    if (value && !value.endsWith('/')) {
        return 'Prefix must end with a forward slash (/)';
    }
    return undefined;
};

type Parameters = FirstInstallationParameters | ValidParameters;

export default function ConfigScreen({ ctx }: PropTypes) {
    return (
        <Canvas ctx={ctx}>
            <FormHandler<Parameters>
                initialValues={ctx.plugin.attributes.parameters}
                onSubmit={async (values) => {
                    await ctx.updatePluginParameters(values);
                    ctx.notice('Settings updated successfully!');
                }}
            >
                {({ handleSubmit, submitting, dirty }) => (
                    <Form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field
                                name="defaultPrefix"
                                validate={validatePrefix}
                            >
                                {({ input, meta: { error } }) => (
                                    <TextField
                                        id="prefix"
                                        label="Default prefix"
                                        hint="If you're not using the prefix in the slug settings, it will fallback to this"
                                        placeholder="https://example.com/"
                                        error={error}
                                        {...input}
                                    />
                                )}
                            </Field>
                            <Field name="forcePrefix">
                                {({ input, meta: { error } }) => (
                                    <SwitchField
                                        id="forcePrefix"
                                        label="Always add the prefix"
                                        hint="Add even though there is a prefix defined in the slug. (This makes it possible to have the default prefix be 'https://www.example.com/' and add your own prefix in the slug field as well)"
                                        error={error}
                                        {...input}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                        <Button
                            type="submit"
                            fullWidth
                            buttonSize="l"
                            buttonType="primary"
                            disabled={submitting || !dirty}
                        >
                            Save settings
                        </Button>
                    </Form>
                )}
            </FormHandler>
        </Canvas>
    );
}
