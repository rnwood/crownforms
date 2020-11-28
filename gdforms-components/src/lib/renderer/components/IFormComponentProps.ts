import { IFormSectionFieldProps, IFormSectionProps } from '.';
import { FieldModel } from '..';
import { IFieldModelOptions, SectionModel, TypedValue } from '../models';

export interface IFormComponentProps {
  hooks?: {
    onRenderSection?: (props: IFormSectionProps) => JSX.Element | undefined;
    onRenderField?: (props: IFormSectionFieldProps) => JSX.Element | undefined;
    onGetFieldVisibility?: (field: FieldModel<TypedValue, IFieldModelOptions>) => boolean;
    onGetSectionVisibility?: (section: SectionModel) => boolean;
  }
}
