import { createStore } from "vuex";
// import db from "../firebase/firebaseInit";

const invoiceData = require("../mock/data.json");

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload;
      });
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.docId !== payload
      );
    },
    INSERT_INVOICE(state, payload) {
      if (payload == null) {
        return;
      }
      state.invoiceData.unshift(payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      console.log(invoiceData);
      // console.log('local json');
      // const getData = db.collection("invoices");
      // const results = await getData.get();
      // console.log(results)
      invoiceData.forEach((doc) => {
        // norepeat
        if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.invoiceId,
            billerStreetAddress: doc.billerStreetAddress,
            billerCity: doc.billerCity,
            billerZipCode: doc.billerZipCode,
            billerCountry: doc.billerCountry,
            clientName: doc.clientName,
            clientEmail: doc.clientEmail,
            clientStreetAddress: doc.clientStreetAddress,
            clientCity: doc.clientCity,
            clientZipCode: doc.clientZipCode,
            clientCountry: doc.clientCountry,
            invoiceDateUnix: doc.invoiceDateUnix,
            invoiceDate: doc.invoiceDate,
            paymentTerms: doc.paymentTerms,
            paymentDueDateUnix: doc.paymentDueDateUnix,
            paymentDueDate: doc.paymentDueDate,
            productDescription: doc.productDescription,
            invoiceItemList: doc.invoiceItemList,
            invoiceTotal: doc.invoiceTotal,
            invoicePending: doc.invoicePending,
            invoiceDraft: doc.invoiceDraft,
            invoicePaid: doc.invoicePaid,
          };
          commit("SET_INVOICE_DATA", data);
        }
      });
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({ commit }, docId) {
      // const getInvoice = db.collection("invoices").doc(docId);
      // await getInvoice.delete();
      commit("DELETE_INVOICE", docId);
    },
    async INSERT_INVOICE({ commit }, data) {
      if (data == null) {
        return;
      }
      commit("DELETE_INVOICE", data.id);
      commit("INSERT_INVOICE", data);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      // const getInvoice = db.collection("invoices").doc(docId);
      // await getInvoice.update({
      //   invoicePaid: true,
      //   invoicePending: false,
      // });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      // const getInvoice = db.collection("invoices").doc(docId);
      // await getInvoice.update({
      //   invoicePaid: false,
      //   invoicePending: true,
      //   invoiceDraft: false,
      // });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});
