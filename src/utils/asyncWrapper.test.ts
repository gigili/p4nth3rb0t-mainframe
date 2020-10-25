// import assert from "assert";
// import asyncWrapper from "./asyncWrapper";
// import { Request, Response, NextFunction } from "express";

// describe("asyncWrapper", () => {
//   it("Calls callback", (done) => {
//     const req = {};
//     const res = {};
//     const next = {};
//     asyncWrapper(
//       (inReq: Request || {}, inRes: Response, inNext: NextFunction) => {
//         try {
//           assert.strictEqual(inReq, req);
//           assert.strictEqual(inRes, res);
//           assert.strictEqual(inNext, next);
//           done();
//         } catch (err) {
//           done(err);
//         }
//       }
//     )(req, res, next);
//   });

//   it("Calls `next` with error if exception is thrown in callback", (done) => {
//     const error = new Error("Testing error");
//     asyncWrapper(() => {
//       throw error;
//     })({}, {}, (inErr: Error) => {
//       try {
//         assert.strictEqual(inErr, error);
//         done();
//       } catch (err) {
//         done(err);
//       }
//     });
//   });

//   it("Calls `next` with error if promise returned by callback rejects", (done) => {
//     const error = new Error("Testing error");
//     asyncWrapper(() => {
//       return Promise.reject(error);
//     })({}, {}, (inErr: Error) => {
//       try {
//         assert.strictEqual(inErr, error);
//         done();
//       } catch (err) {
//         done(err);
//       }
//     });
//   });
// });
