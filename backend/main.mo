import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type CarType = { #sport; #truck; #classic };
  type GameMode = { #singlePlayer; #timeTrial };

  type ScoreEntry = {
    player : Principal;
    car : CarType;
    mode : GameMode;
    time : Nat32;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let scores = Map.empty<Principal, [ScoreEntry]>();

  public shared ({ caller }) func submitScore(car : CarType, mode : GameMode, time : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };

    let newEntry : ScoreEntry = {
      player = caller;
      car;
      mode;
      time;
    };

    let existingScores = switch (scores.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };

    let updatedScores = existingScores.concat([newEntry]);
    scores.add(caller, updatedScores);
  };

  public query func getLeaderboard(car : CarType, mode : GameMode) : async [ScoreEntry] {
    var allEntries : [ScoreEntry] = [];

    for ((_, entries) in scores.entries()) {
      for (entry in entries.values()) {
        if (entry.car == car and entry.mode == mode) {
          allEntries := allEntries.concat([entry]);
        };
      };
    };

    allEntries.sort(func(a, b) { Nat32.compare(a.time, b.time) });
  };
};
