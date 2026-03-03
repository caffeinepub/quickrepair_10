
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";


actor {
  type ContactInquiry = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    serviceType : Text;
    address : Text;
    description : Text;
    preferredTime : Text;
    status : Text;
    timestamp : Time.Time;
  };

  module ContactInquiry {
    public func compareByTimestampDescending(a : ContactInquiry, b : ContactInquiry) : Order.Order {
      if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type MechanicApplication = {
    id : Text;
    name : Text;
    dateOfBirth : Text;
    phone : Text;
    serviceType : Text;
    experience : Text;
    address : Text;
    motivation : Text;
    status : Text;
    timestamp : Time.Time;
  };

  module MechanicApplication {
    public func compareByTimestampDescending(a : MechanicApplication, b : MechanicApplication) : Order.Order {
      if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  // Storage
  var inquiryCounter = 0;
  var applicationCounter = 0;

  let inquiries = Map.empty<Text, ContactInquiry>();
  let applications = Map.empty<Text, MechanicApplication>();

  // Submit Contact Inquiry (returns ID)
  public shared ({ caller }) func submitInquiry(
    name : Text,
    phone : Text,
    email : Text,
    serviceType : Text,
    address : Text,
    description : Text,
    preferredTime : Text,
  ) : async Text {
    if (name.size() == 0) {
      Runtime.trap("Name is empty");
    };

    inquiryCounter += 1;
    let id = "INQ-" # inquiryCounter.toText();

    let inquiry : ContactInquiry = {
      id;
      name;
      phone;
      email;
      serviceType;
      address;
      description;
      preferredTime;
      status = "Pending";
      timestamp = Time.now();
    };

    inquiries.add(id, inquiry);
    id;
  };

  // Submit Mechanic Application (returns ID)
  public shared ({ caller }) func submitApplication(
    name : Text,
    dateOfBirth : Text,
    phone : Text,
    serviceType : Text,
    experience : Text,
    address : Text,
    motivation : Text,
  ) : async Text {
    if (name.size() == 0) {
      Runtime.trap("Name is empty");
    };

    applicationCounter += 1;
    let id = "APP-" # applicationCounter.toText();

    let application : MechanicApplication = {
      id;
      name;
      dateOfBirth;
      phone;
      serviceType;
      experience;
      address;
      motivation;
      status = "Pending";
      timestamp = Time.now();
    };

    applications.add(id, application);
    id;
  };

  // Update Inquiry Status
  public shared ({ caller }) func updateInquiryStatus(id : Text, status : Text) : async () {
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        let updatedInquiry = { inquiry with status };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  // Update Application Status
  public shared ({ caller }) func updateApplicationStatus(id : Text, status : Text) : async () {
    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        let updatedApplication = { application with status };
        applications.add(id, updatedApplication);
      };
    };
  };

  // Get all inquiries (sorted newest first)
  public query ({ caller }) func getAllInquiries() : async [ContactInquiry] {
    inquiries.values().toArray().sort(ContactInquiry.compareByTimestampDescending);
  };

  // Get all applications (sorted newest first)
  public query ({ caller }) func getAllApplications() : async [MechanicApplication] {
    applications.values().toArray().sort(MechanicApplication.compareByTimestampDescending);
  };

  // Get inquiry by ID
  public query ({ caller }) func getInquiryById(id : Text) : async ContactInquiry {
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) { inquiry };
    };
  };

  // Get application by ID
  public query ({ caller }) func getApplicationById(id : Text) : async MechanicApplication {
    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
  };
};
