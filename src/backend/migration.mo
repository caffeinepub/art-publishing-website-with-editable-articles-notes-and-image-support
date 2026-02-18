import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type LoginCredential = {
    username : Text;
    password : Text;
  };

  type OldSession = {
    token : Text;
    expiresAt : Time.Time;
  };

  type OldActor = {
    var loginCredential : ?Text;
    var adminSession : ?OldSession;
  };

  type NewActor = {
    var loginCredential : Map.Map<Text, LoginCredential>;
    var adminSession : ?OldSession;
  };

  public func run(old : OldActor) : NewActor {
    let newLoginCredential = Map.empty<Text, LoginCredential>();
    switch (old.loginCredential) {
      case (null) {}; // No password set, keep empty map
      case (?password) {
        let loginCredential : LoginCredential = {
          username = "adminankit";
          password;
        };
        let adminKey = "admin";
        newLoginCredential.add(adminKey, loginCredential);
      };
    };

    { var loginCredential = newLoginCredential; var adminSession = old.adminSession };
  };
};
