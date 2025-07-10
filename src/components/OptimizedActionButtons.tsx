import { useState, useEffect, useMemo, memo } from "react";
import {
  WrapperField,
  EditButton,
  DeleteButton,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { useRBAC } from "../contexts/RBACContext";

interface ActionButtonsProps {
  resource: string;
  deleteConfirmTitle?: string;
  deleteConfirmContent?: string;
  showEdit?: boolean;
  showDelete?: boolean;
}

interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
}

const OptimizedActionButtonsComponent = ({
  resource,
  deleteConfirmTitle,
  deleteConfirmContent,
  showEdit = true,
  showDelete = true,
}: ActionButtonsProps) => {
  const record = useRecordContext();
  const { checkPermission } = useRBAC();
  const [permissions, setPermissions] = useState<Permissions>({
    canEdit: false,
    canDelete: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the permission key to avoid unnecessary re-checks
  const permissionKey = useMemo(
    () => `${resource}:${record?.created_by || "none"}:${record?.id || "none"}`,
    [resource, record?.created_by, record?.id],
  );

  useEffect(() => {
    if (!record) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const checkPermissions = async () => {
      try {
        // Check both permissions in parallel
        const [canEdit, canDelete] = await Promise.all([
          showEdit
            ? checkPermission("update", resource, record.created_by)
            : Promise.resolve(false),
          showDelete
            ? checkPermission("delete", resource, record.created_by)
            : Promise.resolve(false),
        ]);

        if (!isCancelled) {
          setPermissions({ canEdit, canDelete });
          setIsLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          setPermissions({ canEdit: false, canDelete: false });
          setIsLoading(false);
        }
      }
    };

    checkPermissions();

    return () => {
      isCancelled = true;
    };
  }, [checkPermission, permissionKey, showEdit, showDelete, record, resource]);

  if (!record || isLoading) {
    return null;
  }

  const hasAnyPermission = permissions.canEdit || permissions.canDelete;

  if (!hasAnyPermission) {
    return null;
  }

  return (
    <WrapperField>
      {permissions.canEdit && <EditButton />}
      {permissions.canDelete && (
        <DeleteButton
          confirmTitle={deleteConfirmTitle}
          confirmContent={deleteConfirmContent}
          mutationMode="pessimistic"
        />
      )}
    </WrapperField>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const OptimizedActionButtons = memo(OptimizedActionButtonsComponent);

// Helper function to create action buttons with translations
export const createActionButtons = (
  resource: string,
  options: {
    showEdit?: boolean;
    showDelete?: boolean;
    customDeleteTitle?: string;
    customDeleteContent?: string;
  } = {},
) => {
  const ActionButtons = () => {
    const record = useRecordContext();
    const translate = useTranslate();

    if (!record) return null;

    const deleteTitle =
      options.customDeleteTitle ||
      translate(`dialogs.delete.${resource.slice(0, -1)}.title`);

    const deleteContent =
      options.customDeleteContent ||
      translate(`dialogs.delete.${resource.slice(0, -1)}.content`, {
        name: record.name || record.fullname || record.id,
      });

    return (
      <OptimizedActionButtons
        resource={resource}
        deleteConfirmTitle={deleteTitle}
        deleteConfirmContent={deleteContent}
        showEdit={options.showEdit}
        showDelete={options.showDelete}
      />
    );
  };

  return memo(ActionButtons);
};
