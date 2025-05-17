package com.atharva.backend.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserActionFactory {

    @Autowired
    private CreateAdminAction createAdminAction;

    @Autowired
    private UpgradeToAdminAction upgradeToAdminAction;

    public UserAction getAction(String actionType) {
        switch (actionType.toLowerCase()) {
            case "create":
                return createAdminAction;
            case "upgrade":
                return upgradeToAdminAction;
            default:
                throw new IllegalArgumentException("Invalid action type: " + actionType);
        }
    }
}
