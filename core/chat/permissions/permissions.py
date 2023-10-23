from rest_framework import permissions


class UserIsGroupMember(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_superuser
            or obj.participants.filter(id=request.user.id).exists()
        )


class UserCanDeleteGroup(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_superuser
            or request.user.has_perm('delete_group', obj)
        )


class UserCanChangeGroup(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_superuser
            or request.user.has_perm('change_group', obj)
        )


class UserCanInviteInGroup(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_superuser
            or request.user.has_perm('invite_in_group', obj)
        )


class UserCanAssignGroupRoles(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user.is_superuser
            or request.user.has_perm('assign_roles_in_group', obj)
        )
