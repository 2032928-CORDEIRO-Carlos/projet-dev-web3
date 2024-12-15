import supertest, { Test } from "supertest";
import TestAgent from "supertest/lib/agent";
import { defaultErrMsg as ValidatorErr } from "jet-validator";
import insertUrlParams from "inserturlparams";

import app from "../../../src/app";
import SortRepo from "../../../src/repos/SortRepo";
import { ISort } from "../../../src/models/Sort";
import HttpStatusCodes from "../../../src/common/HttpStatusCodes";

import Paths from "spec/support/Paths";
import apiCb from "spec/support/apiCb";
import { TApiCb } from "spec/types/misc";
import { describe, it } from "node:test";


// Sorts bidon pour les tests
const genererSortsBidon = (): ISort[] => [
  {
    _id: "64b2f2e76f10c05f8d3e344c",
    nom: "Sort de Feu",
    categorie: "Offensif",
    niveauDifficulte: 3,
    description: "Un sort qui lance une boule de feu.",
    dateCreation: new Date(),
    estInterdit: false,
    tags: ["feu", "offensif"],
    puissance: 5,
  },
  {
    _id: "64b2f2e76f10c05f8d3e344d",
    nom: "Sort de Glace",
    categorie: "Défensif",
    niveauDifficulte: 2,
    description: "Un sort qui crée un mur de glace.",
    dateCreation: new Date(),
    estInterdit: false,
    tags: ["glace", "défensif"],
    puissance: 3,
  },
];

// Tests
describe("SortRouter", () => {
  let agent: TestAgent<Test>;

  // Doit rouler avant tous les tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // Récupérer tous les sorts
  describe(`"GET:${Paths.Sorts.Get}"`, () => {
    const api = (cb: TApiCb) =>
      agent.get(Paths.Sorts.Get).end(apiCb(cb));

    it(
      'doit retourner un objet JSON avec tous les sorts et un code de statut ' +
        `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        const data = genererSortsBidon();
        spyOn(SortRepo, "getAll").and.resolveTo(data);

        api((res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ sorts: data });
          done();
        });
      }
    );
  });

  // Ajouter un sort
  describe(`"POST:${Paths.Sorts.Add}"`, () => {
    const ERROR_MSG = `${ValidatorErr}"sort".`,
      SORT_BIDON = genererSortsBidon()[0];

    const callApi = (sort: ISort | null, cb: TApiCb) =>
      agent.post(Paths.Sorts.Add).send({ sort }).end(apiCb(cb));

    it(
      `doit retourner un code de statut "${HttpStatusCodes.CREATED}" si la requête est réussie.`,
      (done) => {
        spyOn(SortRepo, "add").and.resolveTo();

        callApi(SORT_BIDON, (res) => {
          expect(res.status).toBe(HttpStatusCodes.CREATED);
          done();
        });
      }
    );

    it(
      `doit retourner un objet JSON avec un message d'erreur "${ERROR_MSG}" ` +
        `et un code de statut "${HttpStatusCodes.BAD_REQUEST}" si le paramètre est manquant.`,
      (done) => {
        callApi(null, (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(ERROR_MSG);
          done();
        });
      }
    );
  });

  // Mettre à jour un sort
  describe(`"PUT:${Paths.Sorts.Update}"`, () => {
    const ERROR_MSG = `${ValidatorErr}"sort".`,
      SORT_BIDON = genererSortsBidon()[0];

    const callApi = (sort: ISort | null, cb: TApiCb) =>
      agent.put(Paths.Sorts.Update).send({ sort }).end(apiCb(cb));

    it(
      `doit retourner un code de statut "${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        spyOn(SortRepo, "update").and.resolveTo();
        spyOn(SortRepo, "persists").and.resolveTo(true);

        callApi(SORT_BIDON, (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
      }
    );

    it(
      `doit retourner un objet JSON avec un message d'erreur "${ERROR_MSG}" ` +
        `et un code de statut "${HttpStatusCodes.BAD_REQUEST}" si le paramètre est manquant.`,
      (done) => {
        callApi(null, (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(ERROR_MSG);
          done();
        });
      }
    );
  });

  // Supprimer un sort
  describe(`"DELETE:${Paths.Sorts.Delete}"`, () => {
    const callApi = (id: string, cb: TApiCb) =>
      agent
        .delete(insertUrlParams(Paths.Sorts.Delete, { id }))
        .end(apiCb(cb));

    it(
      `doit retourner un code de statut "${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        spyOn(SortRepo, "delete").and.resolveTo();
        spyOn(SortRepo, "persists").and.resolveTo(true);

        callApi(genererSortsBidon()[0]._id, (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
      }
    );

    it(
      `doit retourner un code de statut "${HttpStatusCodes.NOT_FOUND}" si le sort n'existe pas.`,
      (done) => {
        callApi("64b2f2e76f10c05f8d3e344f", (res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          done();
        });
      }
    );
  });
});
