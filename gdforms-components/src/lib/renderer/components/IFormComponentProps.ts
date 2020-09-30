import { IFormSectionFieldProps, IFormSectionProps } from '.';

export interface IFormComponentProps {
  hooks: {
    onRenderSection?: (props: IFormSectionProps) => JSX.Element | undefined;
    onRenderField?: (props: IFormSectionFieldProps) => JSX.Element | undefined;
  }
}
