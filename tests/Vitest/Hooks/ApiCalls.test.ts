import { expect, it, describe, beforeEach, afterEach, vi } from "vitest";
import { createElement, type ReactNode } from "react";
import {
  getRandomRecipeQueryOption,
  getRecipesQueryOption,
  getRecipesByCategoryQueryOption,
  getAllCategoriesQueryOption,
  getRecipeByIdQueryOption,
} from "../../../src/Hooks/ApiCalls.js";
import {
  QueryClient,
  useQuery,
  QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getRandomRecipeQueryOption", () => {
  const mockMeal = {
    meals: [{ idMeal: "52772", strMeal: "Teriyaki Chicken Casserole" }],
  };

  it("returns data from the random recipe endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMeal),
        }),
      ),
    );
    const { result } = renderHook(
      () => useQuery(getRandomRecipeQueryOption()),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMeal);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/random.php"));
  });

  it("returns an error when fetching fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getRandomRecipeQueryOption()),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/random.php"));
  });
});

describe("getRecipesQueryOption", () => {
  const mockMeal = {
    meals: [{ idMeal: "52772", strMeal: "Teriyaki Chicken Casserole" }],
  };

  it("returns data from search endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMeal),
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getRecipesQueryOption(null, "s")),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/search.php"));
  });

  it("returns data from ingredients endpoint", async () => {
    const { result } = renderHook(
      () => useQuery(getRecipesQueryOption("chicken", "i")),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
  });

  it("returns an error when search fetching fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getRecipesQueryOption(null, "s")),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error).not.toBeNull();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/search.php"));
  });
});

describe("getRecipesByCategoryQueryOption", () => {
  it("returns data from category endpoint", async () => {
    const { result } = renderHook(
      () => useQuery(getRecipesByCategoryQueryOption("chicken")),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
  });

  it("returns an error when fetching meals by category fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getRecipesByCategoryQueryOption("chicken")),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error).not.toBeNull();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/filter.php"));
  });
});

describe("getAllCategoriesQueryOption", () => {
  it("returns data from category endpoint", async () => {
    const { result } = renderHook(
      () => useQuery(getAllCategoriesQueryOption()),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
  });

  it("returns an error when fetching meals by category fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getAllCategoriesQueryOption()),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error).not.toBeNull();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories.php"),
    );
  });
});
describe("getRecipeByIdQueryOption", () => {
  it("returns data from category endpoint", async () => {
    const { result } = renderHook(
      () => useQuery(getRecipeByIdQueryOption(53281)),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
  });

  it("returns an error when fetching meals by category fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ),
    );

    const { result } = renderHook(
      () => useQuery(getRecipeByIdQueryOption(53281)),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error).not.toBeNull();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/lookup.php"));
  });
});
