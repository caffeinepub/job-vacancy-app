import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";



actor {
  module JobListing {
    public func compare(a : JobListing, b : JobListing) : Order.Order {
      switch (Text.compare(a.jobId, b.jobId)) {
        case (#equal) { Text.compare(a.title, b.title) };
        case (order) { order };
      };
    };
  };

  module JobType {
    public func compare(a : JobType, b : JobType) : Order.Order {
      let aIndex = switch a {
        case (#fullTime) { 0 };
        case (#partTime) { 1 };
        case (#contract) { 2 };
        case (#remote) { 3 };
      };
      let bIndex = switch b {
        case (#fullTime) { 0 };
        case (#partTime) { 1 };
        case (#contract) { 2 };
        case (#remote) { 3 };
      };
      Nat.compare(aIndex, bIndex);
    };
  };

  type VacancyStatus = {
    #new_;
    #old;
    #draft;
  };

  type JobType = {
    #fullTime;
    #partTime;
    #contract;
    #remote;
  };

  type JobListing = {
    jobId : Text;
    title : Text;
    company : Text;
    country : Text;
    state : Text;
    city : Text;
    district : Text;
    jobType : JobType;
    salaryMin : Nat;
    salaryMax : Nat;
    salaryCurrency : Text;
    description : Text;
    datePosted : Time.Time;
    status : VacancyStatus;
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

  type ApplicationResult = {
    #ok : Text;
    #error : Text;
  };

  var nextJobId = 6;
  var nextApplicationId = 1;

  let jobListings = Map.fromIter<Text, JobListing>(
    [
      (
        "1",
        {
          jobId = "1";
          title = "Software Engineer";
          company = "TCS";
          country = "India";
          state = "Karnataka";
          city = "Bangalore";
          district = "Bangalore Urban";
          jobType = #fullTime;
          salaryMin = 500_000;
          salaryMax = 900_000;
          salaryCurrency = "INR";
          description = "Develop and maintain software applications for major clients.";
          datePosted = 1718109530;
          status = #new_;
        },
      ),
      (
        "2",
        {
          jobId = "2";
          title = "Data Analyst";
          company = "Infosys";
          country = "India";
          state = "Maharashtra";
          city = "Mumbai";
          district = "Mumbai Suburban";
          jobType = #fullTime;
          salaryMin = 400_000;
          salaryMax = 800_000;
          salaryCurrency = "INR";
          description = "Analyze large datasets and create insightful reports.";
          datePosted = 1718419530;
          status = #old;
        },
      ),
      (
        "3",
        {
          jobId = "3";
          title = "Remote Java Developer";
          company = "Wipro";
          country = "India";
          state = "Delhi";
          city = "New Delhi";
          district = "Central Delhi";
          jobType = #remote;
          salaryMin = 700_000;
          salaryMax = 1_000_000;
          salaryCurrency = "INR";
          description = "Work remotely on Java backend projects for international clients.";
          datePosted = 1719246730;
          status = #new_;
        },
      ),
      (
        "4",
        {
          jobId = "4";
          title = "Senior Project Manager";
          company = "Flipkart";
          country = "India";
          state = "Tamil Nadu";
          city = "Chennai";
          district = "Chennai";
          jobType = #fullTime;
          salaryMin = 1_200_000;
          salaryMax = 2_000_000;
          salaryCurrency = "INR";
          description = "Lead project teams and coordinate with stakeholders for ecommerce solutions.";
          datePosted = 1719546730;
          status = #draft;
        },
      ),
      (
        "5",
        {
          jobId = "5";
          title = "HR Executive";
          company = "Apollo Hospitals";
          country = "India";
          state = "Gujarat";
          city = "Ahmedabad";
          district = "Ahmedabad";
          jobType = #fullTime;
          salaryMin = 350_000;
          salaryMax = 600_000;
          salaryCurrency = "INR";
          description = "Manage recruitment and employee relations in a healthcare environment.";
          datePosted = 1719806730;
          status = #new_;
        },
      ),
      (
        "6",
        {
          jobId = "6";
          title = "Marketing Specialist";
          company = "Reliance";
          country = "India";
          state = "West Bengal";
          city = "Kolkata";
          district = "Kolkata";
          jobType = #fullTime;
          salaryMin = 450_000;
          salaryMax = 750_000;
          salaryCurrency = "INR";
          description = "Develop and implement marketing strategies across multiple channels.";
          datePosted = 1720106730;
          status = #old;
        },
      ),
    ].values(),
  );

  let jobApplications = Map.empty<Text, JobApplication>();

  public query ({ caller }) func getAllJobs() : async [JobListing] {
    jobListings.values().toArray().sort();
  };

  public query ({ caller }) func getJobById(jobId : Text) : async ?JobListing {
    jobListings.get(jobId);
  };

  public query ({ caller }) func getVacanciesByStatus(status : VacancyStatus) : async [JobListing] {
    jobListings.values().toArray().filter(
      func(l) { l.status == status }
    );
  };

  public query ({ caller }) func getApplicationsForJob(jobId : Text) : async [JobApplication] {
    jobApplications.values().toArray().filter(
      func(app) { app.jobId == jobId }
    );
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

  public shared ({ caller }) func postVacancy(
    title : Text,
    company : Text,
    country : Text,
    state : Text,
    city : Text,
    district : Text,
    jobType : JobType,
    salaryMin : Nat,
    salaryMax : Nat,
    salaryCurrency : Text,
    description : Text,
    status : VacancyStatus,
  ) : async Text {
    let jobId = nextJobId.toText();
    nextJobId += 1;

    let newJobListing : JobListing = {
      jobId;
      title;
      company;
      country;
      state;
      city;
      district;
      jobType;
      salaryMin;
      salaryMax;
      salaryCurrency;
      description;
      datePosted = Time.now();
      status;
    };

    jobListings.add(jobId, newJobListing);

    jobId;
  };

  public query ({ caller }) func countJobTypes() : async {
    fullTime : Nat;
    partTime : Nat;
    contract : Nat;
    remote : Nat;
  } {
    jobListings.values().toArray().foldLeft(
      { fullTime = 0; partTime = 0; contract = 0; remote = 0 },
      func(acc, job) {
        switch (job.jobType) {
          case (#fullTime) { { acc with fullTime = acc.fullTime + 1 } };
          case (#partTime) { { acc with partTime = acc.partTime + 1 } };
          case (#contract) { { acc with contract = acc.contract + 1 } };
          case (#remote) { { acc with remote = acc.remote + 1 } };
        };
      },
    );
  };

  public query ({ caller }) func getJobCount() : async Nat {
    jobListings.size();
  };

  public query ({ caller }) func getApplicationCount() : async Nat {
    jobApplications.size();
  };
};
