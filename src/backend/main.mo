import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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

  // Content management
  public shared ({ caller }) func createArticle(
    title : Text,
    body : Text,
    coverImage : ?Storage.ExternalBlob,
  ) : async Article {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can manage content");
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
  ) : async Article {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update content");
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

  public shared ({ caller }) func publishArticle(id : Text) : async Article {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can publish content");
    };
    let article = switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article with ID does not exist") };
      case (?content) { content };
    };

    let updatedArticle = { article with status = #published };
    articlesMap.add(id, updatedArticle);
    updatedArticle;
  };

  public shared ({ caller }) func unpublishArticle(id : Text) : async Article {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can unpublish content");
    };
    let article = switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article with ID does not exist") };
      case (?content) { content };
    };

    let updatedArticle = { article with status = #draft };
    articlesMap.add(id, updatedArticle);
    updatedArticle;
  };

  // Public API
  public query func getPublishedArticles() : async [Article] {
    articlesMap.values().toArray().filter(
      func(article) {
        article.status == #published;
      }
    ).sort(Article.compareByCreatedAt);
  };

  public query ({ caller }) func getArticleById(id : Text) : async ?Article {
    let article = articlesMap.get(id);
    switch (article) {
      case (null) { null };
      case (?c) {
        if (c.status == #draft and not AccessControl.isAdmin(accessControlState, caller)) {
          null;
        } else {
          ?c;
        };
      };
    };
  };
};
