import { useState } from 'react';
import { IconButton } from '../../components/buttons/Buttons';
import { XLarge, Pencil } from '../../components/graphics/icons';
import { PrimaryLine, TwoLineRow } from '../../components/list/TwoLineRow';

export function AccountRow(
  props: {
    title: string;
    isEditing: boolean;
    onEdit: () => void;
    editContent: JSX.Element;
    nonEditContent: JSX.Element;
  }
) {

  return (
    <TwoLineRow
      first={<PrimaryLine
        text={props.title}
        trailIcon={<EditButton
          editing={props.isEditing}
          onEdit={props.onEdit}
        />}
      />}
      second={
        props.isEditing ?
        props.editContent :
        props.nonEditContent
      }
    />
  );
}

export function EditButton(
  props: {
    editing: boolean;
    onEdit: () => void;
  }
) {
  return (
    <IconButton
      icon={
        props.editing ?
        <XLarge /> :
        <Pencil />
      }
      onClick={props.onEdit}
    />
  );
}

export function useEditState() {
  const [ onOff, setOnOff ] = useState(false);

  const toggle = () => {
    setOnOff(prev => {
      return !prev;
    });
  };

  return {
    onOff,
    toggle,
  };
}
