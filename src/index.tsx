import {
    connect,
    Field,
    FieldIntentCtx,
    RenderFieldExtensionCtx,
} from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import ConfigScreen from './entrypoints/ConfigScreen';
import { render } from './utils/render';
import { Button, Canvas } from 'datocms-react-ui';

connect({
    renderConfigScreen(ctx) {
        return render(<ConfigScreen ctx={ctx} />);
    },

    overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
        if (field.attributes.field_type === 'slug') {
            return {
                addons: [{ id: 'copySlug' }],
            };
        }
    },

    renderFieldExtension(
        fieldExtensionId: string,
        ctx: RenderFieldExtensionCtx
    ) {
        const { defaultPrefix, forcePrefix } = ctx.plugin.attributes.parameters;

        const slugPrefix =
            ctx.field.attributes.appearance.parameters.url_prefix || undefined;
        const slugValue = ctx.formValues[
            ctx.field.attributes.api_key
        ] as string;

        const textToCopy = `${forcePrefix ? defaultPrefix : ''}${
            (slugPrefix ? slugPrefix : !forcePrefix ? defaultPrefix : '') +
            slugValue
        }`;

        const handleCopy = async () => {
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    ctx.notice(`${textToCopy} Copied to clipboard`);
                })
                .catch((err) => {
                    ctx.customToast({
                        type: 'alert',
                        message: 'something went wrong copying the slug',
                    });
                });
        };

        if (fieldExtensionId === 'copySlug') {
            console.log(slugPrefix, forcePrefix);
            const isDisabled = !Boolean(slugPrefix) && !forcePrefix;

            return render(
                <Canvas ctx={ctx}>
                    <Button
                        disabled={isDisabled}
                        buttonType="primary"
                        onClick={handleCopy}
                    >
                        Copy Slug
                    </Button>
                    {isDisabled && (
                        <p style={{ color: 'red' }}>
                            URL prefix is required to copy the slug.
                        </p>
                    )}
                </Canvas>
            );
        }
    },
});
