namespace HealthFitness.API.Security;

public static class Permissions
{
    public static class Activities
    {
        public const string View = "Permissions.Activities.View";
        public const string Create = "Permissions.Activities.Create";
        public const string Edit = "Permissions.Activities.Edit";
        public const string Delete = "Permissions.Activities.Delete";
    }

    public static class Nutrition
    {
        public const string View = "Permissions.Nutrition.View";
        public const string Create = "Permissions.Nutrition.Create";
        public const string Edit = "Permissions.Nutrition.Edit";
        public const string Delete = "Permissions.Nutrition.Delete";
    }

    public static class Sleep
    {
        public const string View = "Permissions.Sleep.View";
        public const string Create = "Permissions.Sleep.Create";
        public const string Edit = "Permissions.Sleep.Edit";
        public const string Delete = "Permissions.Sleep.Delete";
    }
    
    public static class Goals
    {
        public const string View = "Permissions.Goals.View";
        public const string Create = "Permissions.Goals.Create";
        public const string Edit = "Permissions.Goals.Edit";
        public const string Delete = "Permissions.Goals.Delete";
    }

    public static class Water
    {
        public const string View = "Permissions.Water.View";
        public const string Log = "Permissions.Water.Log";
    }

    public static class Social
    {
        public const string View = "Permissions.Social.View";
        public const string Interact = "Permissions.Social.Interact";
    }

    public static class Achievements
    {
        public const string View = "Permissions.Achievements.View";
    }

    public static class Admin
    {
        public const string AccessPanel = "Permissions.Admin.AccessPanel";
        public const string ManageUsers = "Permissions.Admin.ManageUsers";
        public const string ViewRoles = "Permissions.Admin.ViewRoles";
        public const string ManageRoles = "Permissions.Admin.ManageRoles";
        
        // System Administration
        public const string ConfigureSettings = "Permissions.Admin.ConfigureSettings";
        public const string ViewSystemLogs = "Permissions.Admin.ViewSystemLogs"; // Monitor performance
        public const string ManageBackups = "Permissions.Admin.ManageBackups";
        
        // Advanced User Management
        public const string ManageReports = "Permissions.Admin.ManageReports"; // Handle complaints
        public const string ManageAccountRecovery = "Permissions.Admin.ManageAccountRecovery";
        public const string ViewAnalytics = "Permissions.Admin.ViewAnalytics"; // Aggregated data
    }

    public static List<string> GetAllPermissions()
    {
        var permissions = new List<string>();
        foreach (var prop in typeof(Permissions).GetNestedTypes().SelectMany(c => c.GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.FlattenHierarchy)))
        {
            var propertyValue = prop.GetValue(null);
            if (propertyValue != null)
                permissions.Add(propertyValue.ToString()!);
        }
        return permissions;
    }
}

