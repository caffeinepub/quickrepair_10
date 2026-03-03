import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  // Contact Inquiry Type and Comparison
  type ContactInquiry = {
    name : Text;
    phone : Text;
    email : Text;
    serviceType : Text;
    address : Text;
    description : Text;
    preferredTime : Text;
    timestamp : Time.Time;
  };

  module ContactInquiry {
    public func compareByName(a : ContactInquiry, b : ContactInquiry) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // Mechanic Application Type and Comparison
  type MechanicApplication = {
    name : Text;
    dateOfBirth : Text;
    phone : Text;
    serviceType : Text;
    experience : Text;
    address : Text;
    motivation : Text;
    timestamp : Time.Time;
  };

  module MechanicApplication {
    public func compareByName(a : MechanicApplication, b : MechanicApplication) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // Storage
  let inquiries = Map.empty<Text, ContactInquiry>();
  let applications = Map.empty<Text, MechanicApplication>();

  // Submit Contact Inquiry
  public shared ({ caller }) func submitInquiry(
    name : Text,
    phone : Text,
    email : Text,
    serviceType : Text,
    address : Text,
    description : Text,
    preferredTime : Text,
  ) : async () {
    if (name.size() == 0) {
      Runtime.trap("Name is empty");
    };

    let inquiry : ContactInquiry = {
      name;
      phone;
      email;
      serviceType;
      address;
      description;
      preferredTime;
      timestamp = Time.now();
    };

    inquiries.add(name, inquiry);
  };

  // Submit Mechanic Application
  public shared ({ caller }) func submitApplication(
    name : Text,
    dateOfBirth : Text,
    phone : Text,
    serviceType : Text,
    experience : Text,
    address : Text,
    motivation : Text,
  ) : async () {
    if (name.size() == 0) {
      Runtime.trap("Name is empty");
    };

    let application : MechanicApplication = {
      name;
      dateOfBirth;
      phone;
      serviceType;
      experience;
      address;
      motivation;
      timestamp = Time.now();
    };

    applications.add(name, application);
  };

  // Get all inquiries
  public query ({ caller }) func getAllInquiries() : async [ContactInquiry] {
    inquiries.values().toArray().sort(ContactInquiry.compareByName);
  };

  // Get all applications
  public query ({ caller }) func getAllApplications() : async [MechanicApplication] {
    applications.values().toArray().sort(MechanicApplication.compareByName);
  };

  // Get inquiry by name
  public query ({ caller }) func getInquiryByName(name : Text) : async ContactInquiry {
    switch (inquiries.get(name)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) { inquiry };
    };
  };

  // Get application by name
  public query ({ caller }) func getApplicationByName(name : Text) : async MechanicApplication {
    switch (applications.get(name)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
  };
};
