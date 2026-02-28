import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

actor {
  module JobListing {
    public func compare(a : JobListing, b : JobListing) : Order.Order {
      switch (Text.compare(a.jobId, b.jobId)) {
        case (#equal) { (Text.compare(a.title, b.title)) };
        case (order) { order };
      };
    };
  };

  type JobListing = {
    jobId : Text;
    title : Text;
    company : Text;
    district : Text;
    state : Text;
    jobType : JobType;
    salaryMin : Nat;
    salaryMax : Nat;
    salaryCurrency : Text;
    description : Text;
    datePosted : Time.Time;
  };

  type JobApplication = {
    applicationId : Text;
    jobId : Text;
    applicantName : Text;
    email : Text;
    phone : Text;
    coverLetter : Text;
    submittedAt : Time.Time;
  };

  type JobType = {
    #fullTime;
    #partTime;
    #contract;
    #remote;
  };

  let jobApplications = Map.empty<Text, JobApplication>();
  var nextApplicationId = 1;

  let jobListings = Map.fromIter<Text, JobListing>(
    [
      (
        "1",
        {
          jobId = "1";
          title = "Software Engineer";
          company = "Acme Corp";
          district = "Berlin";
          state = "Berlin";
          jobType = #fullTime;
          salaryMin = 50000;
          salaryMax = 80000;
          salaryCurrency = "USD";
          description = "Develop and maintain software applications.";
          datePosted = 1718109530;
        },
      ),
      (
        "2",
        {
          jobId = "2";
          title = "Tech Recruiter";
          company = "Acme Corp";
          district = "Berlin";
          state = "Berlin";
          jobType = #fullTime;
          salaryMin = 48000;
          salaryMax = 72000;
          salaryCurrency = "USD";
          description = "Develop recruiting pipelines for software developers.";
          datePosted = 1718419530;
        },
      ),
      (
        "3",
        {
          jobId = "3";
          title = "Remote Java Dev";
          company = "Acme Corp";
          district = "Berlin";
          state = "Berlin";
          jobType = #remote;
          salaryMin = 70000;
          salaryMax = 100000;
          salaryCurrency = "USD";
          description = "Develop Java backend applications for banking clients running on the Internet Computer.";
          datePosted = 1719246730;
        },
      ),
      (
        "4",
        {
          jobId = "4";
          title = "Senior Java Developer";
          company = "Acme Corp";
          district = "Berlin";
          state = "Berlin";
          jobType = #fullTime;
          salaryMin = 90000;
          salaryMax = 120000;
          salaryCurrency = "USD";
          description = "Develop Java backend applications for smart city clients running on the Internet Computer.";
          datePosted = 1719546730;
        },
      ),
    ].values(),
  );

  public query ({ caller }) func getAllJobs() : async [JobListing] {
    jobListings.values().toArray().sort();
  };

  public query ({ caller }) func getJobById(jobId : Text) : async JobListing {
    switch (jobListings.get(jobId)) {
      case (?listing) { listing };
      case (null) { Runtime.trap("Job not found") };
    };
  };

  public type ApplicationResult = {
    #ok : Text;
    #error : Text;
  };

  public shared ({ caller }) func submitApplication(
    jobId : Text,
    applicantName : Text,
    email : Text,
    phone : Text,
    coverLetter : Text,
  ) : async ApplicationResult {
    switch (jobListings.get(jobId)) {
      case (null) { #error("Job not found") };
      case (?_) {
        let applicationId = nextApplicationId.toText();
        nextApplicationId += 1;

        let application : JobApplication = {
          applicationId;
          jobId;
          applicantName;
          email;
          phone;
          coverLetter;
          submittedAt = Time.now();
        };

        jobApplications.add(applicationId, application);

        #ok(applicationId);
      };
    };
  };

  public query ({ caller }) func getApplicationsForJob(jobId : Text) : async [JobApplication] {
    jobApplications.values().toArray().filter(
      func(app) { app.jobId == jobId }
    );
  };
};
