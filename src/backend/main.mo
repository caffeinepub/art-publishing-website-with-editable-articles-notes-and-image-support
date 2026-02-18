import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Content Types
  type ContentStatus = { #draft; #published };

  type Article = {
    id : Text;
    title : Text;
    body : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    coverImage : ?Storage.ExternalBlob;
    status : ContentStatus;
  };

  module Article {
    public func compareByCreatedAt(a : Article, b : Article) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  // Persistent storage for all content
  type ID = Text;
  let articlesMap = Map.empty<ID, Article>();

  // Utility function to trim spaces from Text
  func trimSpaces(text : Text) : Text {
    text.trim(#predicate(func(c) { c == ' ' or c == '\t' or c == '\n' or c == '\r' }));
  };

  // Backwards compatible: Authenticate using principal (Id) or admin session token.
  func isAuthorized(caller : Principal, sessionToken : ?Text) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };

    switch (sessionToken) {
      case (?token) {
        validateSession(token);
        true;
      };
      case (_) { false };
    };
  };

  // Content management (admin only)
  public shared ({ caller }) func createArticle(
    title : Text,
    body : Text,
    coverImage : ?Storage.ExternalBlob,
    sessionToken : ?Text,
  ) : async Article {
    if (not isAuthorized(caller, sessionToken)) {
      Runtime.trap("Unauthorized: Only admin users can create articles");
    };

    let id = trimSpaces(title).replace(#char(' '), "-").toLower();
    let newArticle : Article = {
      id;
      title;
      body;
      createdAt = Time.now();
      updatedAt = Time.now();
      coverImage;
      status = #draft;
    };

    articlesMap.add(id, newArticle);
    newArticle;
  };

  public shared ({ caller }) func updateArticle(
    id : Text,
    title : Text,
    body : Text,
    coverImage : ?Storage.ExternalBlob,
    sessionToken : ?Text,
  ) : async Article {
    if (not isAuthorized(caller, sessionToken)) {
      Runtime.trap("Unauthorized: Only admin users can update articles");
    };

    let existingArticle = switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article with ID does not exist") };
      case (?content) { content };
    };

    let updatedArticle : Article = {
      id;
      title;
      body;
      createdAt = existingArticle.createdAt;
      updatedAt = Time.now();
      coverImage;
      status = existingArticle.status;
    };

    articlesMap.add(id, updatedArticle);
    updatedArticle;
  };

  public shared ({ caller }) func publishArticle(
    id : Text,
    sessionToken : ?Text,
  ) : async Article {
    if (not isAuthorized(caller, sessionToken)) {
      Runtime.trap("Unauthorized: Only admin users can publish articles");
    };
    let article = switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article with ID does not exist") };
      case (?content) { content };
    };

    let updatedArticle = { article with status = #published };
    articlesMap.add(id, updatedArticle);
    updatedArticle;
  };

  public shared ({ caller }) func unpublishArticle(id : Text, sessionToken : ?Text) : async Article {
    if (not isAuthorized(caller, sessionToken)) {
      Runtime.trap("Unauthorized: Only admin users can unpublish articles");
    };
    let article = switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article with ID does not exist") };
      case (?content) { content };
    };

    let updatedArticle = { article with status = #draft };
    articlesMap.add(id, updatedArticle);
    updatedArticle;
  };

  // SESSION MANAGEMENT

  type LoginCredential = {
    username : Text;
    password : Text;
  };

  type Session = {
    token : Text;
    expiresAt : Time.Time;
  };

  let loginCredential = Map.empty<Text, LoginCredential>();
  var adminSession : ?Session = null;

  func generateSessionToken() : Text {
    let timestamp = Time.now().toText();
    let randomComponent = (Time.now() % 999999999).toText();
    timestamp.concat(randomComponent);
  };

  func validateSession(token : Text) : () {
    switch (adminSession) {
      case (?session) {
        if (session.token != token or Time.now() > session.expiresAt) {
          Runtime.trap("Unauthorized: Invalid or expired session token");
        };
      };
      case (null) { Runtime.trap("Unauthorized: No active session") };
    };
  };

  /// Overwrite current admin credentials with default admin account
  /// SECURITY: This function requires admin authorization when credentials already exist.
  /// For first-time setup, it requires the caller to be an admin via AccessControl.
  public shared ({ caller }) func resetDefaultAdminCredential() : async () {
    let adminKey = "admin"; // Use a fixed key for the single credential

    switch (loginCredential.get(adminKey)) {
      case (null) {
        // First-time initialization: require admin role via AccessControl
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admin users can initialize credentials");
        };
        loginCredential.add(adminKey, { username = "adminankit"; password = "ankits-0812" });
      };
      case (?_) {
        // Updating existing credential: require admin authorization
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admin users can update credentials");
        };
        loginCredential.add(adminKey, { username = "adminankit"; password = "ankits-0812" });
      };
    };
  };

  // Session management
  public shared ({ caller }) func login(username : Text, password : Text) : async Text {
    validateCredential(username, password);
    let token = generateSessionToken();
    adminSession := ?{
      token;
      expiresAt = Time.now() + 8 * 60 * 60 * 1000000000;
    };
    token;
  };

  public shared ({ caller }) func logout(sessionToken : Text) : async () {
    validateSession(sessionToken);
    adminSession := null;
  };

  // Helper function for credential validation
  func validateCredential(username : Text, password : Text) : () {
    let adminKey = "admin";
    switch (loginCredential.get(adminKey)) {
      case (null) { Runtime.trap("Unauthorized: No credentials configured") };
      case (?currentCredential) {
        if (
          username != currentCredential.username or password != currentCredential.password
        ) {
          Runtime.trap("Unauthorized: Invalid credentials");
        };
      };
    };
  };

  // Public API - read access
  public query func getPublishedArticles() : async [Article] {
    articlesMap.values().toArray().filter(
      func(article) {
        article.status == #published;
      }
    ).sort(Article.compareByCreatedAt);
  };

  public query ({ caller }) func getArticleById(id : Text, sessionToken : ?Text) : async ?Article {
    let article = articlesMap.get(id);
    switch (article) {
      case (null) { null };
      case (?a) {
        // Published articles are visible to everyone
        if (a.status == #published) {
          return ?a;
        };
        // Draft articles only visible to admins
        if (isAuthorized(caller, sessionToken)) {
          return ?a;
        };
        // Non-admin trying to access draft
        null;
      };
    };
  };

  // Admin-only: Get all articles including drafts
  public query ({ caller }) func getAllArticles(sessionToken : ?Text) : async [Article] {
    if (not isAuthorized(caller, sessionToken)) {
      Runtime.trap("Unauthorized: Only admin users can view all articles");
    };
    articlesMap.values().toArray().sort(Article.compareByCreatedAt);
  };
};
